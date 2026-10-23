const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const compression = require("compression");
const ejs = require("ejs");
const helmet = require("helmet");

const app = express();
const cspNonce = crypto.randomBytes(16).toString("hex");
const port = process.env.PORT || 8080;

// Add Helmet middleware to protect unauthorized or malicious script
app.use(
    helmet({
        referrerPolicy: { policy: "no-referrer" },
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
                scriptSrc: ["'self'", (_req, _res) => `'nonce-${cspNonce}'`, "https://js.stripe.com/", "https://r.stripe.com/"],
                formAction: null,
                imgSrc: [
                    "'self'",
                    "data:",
                    "blob:",
                    "https://storage.googleapis.com", // Allow broader domain
                    "https://storage.googleapis.com/petracentraldev"
                ], // Keep specific subpath],
                frameAncestors: null,
                styleSrc: null,
                frameSrc: ["'self'", "https://js.stripe.com/", "https://r.stripe.com/"],
                fontSrc: ["'self'"],
                mediaSrc: [
                    "'self'",
                    "http://keycloak:8080", // Allow Keycloak connection within Docker compose network
                    "http://localhost:5230",
                    "https://storage.googleapis.com", // Allow broader domain
                    "https://storage.googleapis.com/petracentraldev" // Keep specific subpath
                ],
                connectSrc: [
                    "'self'",
                    "http://keycloak:8080",
                    "http://localhost:5230",
                    "https://petracentralrestapi-hvgndzekdeava6cg.canadacentral-01.azurewebsites.net",
                    "https://storage.googleapis.com",
                    "wss://petracentralrestapi-hvgndzekdeava6cg.canadacentral-01.azurewebsites.net",
                    "data:"
                ],
                manifestSrc: ["'self'"]
            }
        }
    })
);
app.use("/", helmet.noSniff());
app.use("/", (_req, res, next) => {
    res.setHeader("Permissions-Policy", "camera=(), geolocation=(), storage-access=(self)");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    });
    res.cookie("nonce-csp", cspNonce, {
        secure: true,
        expires: new Date(Date.now() + 86400000),
        sameSite: "strict"
    });
    next();
});

// Server only Angular binary build files
app.use(express.static(path.join(__dirname), "public"));

// Handle Angular Routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.info("TMS Customer Portal Server running on:", port);
});