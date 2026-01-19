import express from "express";
import path from "path";

export const staticUploads = express.static(
  path.join(__dirname, "..", "..", "uploads")
);
