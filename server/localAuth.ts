import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export function getSession() {
  const sessionTtl = 4 * 30 * 1000; // 4mins 30secs 1000ms
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    // In Docker or fresh environments the sessions table might not exist yet.
    // Auto-create it to prevent session store errors that surface as 500 on /api/login.
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // CSRF protection: validate origin/referer for state-changing requests
  app.use((req, res, next) => {
    // Skip for safe methods (GET, HEAD, OPTIONS)
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    // Skip for auth endpoints
    if (req.path === "/api/login" || req.path === "/api/logout") {
      return next();
    }

    const origin = req.get("origin");
    const referer = req.get("referer");
    const host = req.get("host");

    // In development, allow localhost origins
    if (process.env.NODE_ENV === "development") {
      if (origin?.includes("localhost") || origin?.includes("127.0.0.1") || 
          referer?.includes("localhost") || referer?.includes("127.0.0.1") ||
          origin?.includes(host || "")) {
        return next();
      }
    }

    // In production, validate origin matches host
    if (origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return res.status(403).json({ error: "Invalid origin" });
      }
      return next();
    }

    // If referer is present, validate it
    if (referer && host) {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        return res.status(403).json({ error: "Invalid referer" });
      }
      return next();
    }

    // Allow if origin/referer validation passes or is not present
    // (some clients may not send these headers)
    next();
  });

  // Local strategy for email/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const normalizedEmail = (email || "").trim().toLowerCase();
          const user = await storage.getUserByEmail(normalizedEmail);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.passwordHash) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Some databases might contain non-bcrypt hashes. If bcrypt.compare throws,
          // treat it as invalid credentials instead of a server error.
          let isValid = false;
          try {
            isValid = await bcrypt.compare(password, user.passwordHash);
          } catch (_e) {
            return done(null, false, { message: "Invalid email or password" });
          }
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          // Do not leak internal errors to the client during login
          return done(null, false, { message: "Invalid email or password" });
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(null, false);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed" });
        }
        return res.json({ 
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          departmentId: user.departmentId,
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = req.user as User;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      departmentId: user.departmentId,
      profileImageUrl: user.profileImageUrl,
    });
  });
}

export function requireAuth(): RequestHandler {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };
}

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return (req, res, next) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = req.user as User;
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}
