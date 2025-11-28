import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";
import { storage } from "./storage";
import { seedUsers } from "./seed-users";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  // Auto-seed if no users exist
  try {
    const userCount = await storage.getUserCount();
    if (userCount === 0) {
      await seedUsers();
    }
  } catch (error) {
    console.error("Failed to auto-seed:", error);
  }

  await runApp(serveStatic);
})();
