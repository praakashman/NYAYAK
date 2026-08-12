#!/usr/bin/env node
const http = require("http");
const https = require("https");

const host = process.env.CONVEX_HOST || "http://localhost:8787";
const secret = process.env.SEED_SECRET || "";

if (!secret) {
  console.error("SEED_SECRET is not set. Set it in the environment and retry.");
  process.exit(1);
}

const url = new URL("/seed-dummy", host);
url.searchParams.set("secret", secret);

const lib = url.protocol === "https:" ? https : http;

const req = lib.get(url.toString(), (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      console.log(JSON.parse(data));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on("error", (err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
