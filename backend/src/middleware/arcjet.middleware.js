import { aj } from "../config/arcjet.js"

export const arcjetMiddleware = async (req, res, next) => {
    try {
        if (req.get("X-Arcjet-Allow") === "mobile-app") {
            return next()
        }

        // Arcjet beta.8 ignores an `ip` argument and, with RENDER=true, only
        // reads `true-client-ip`. Feed it Express' proxy-resolved XFF address.
        const decision = await aj.protect({
            headers: { ...req.headers, "true-client-ip": req.ip },
            socket: req.socket,
            method: req.method,
            httpVersion: req.httpVersion,
            url: req.originalUrl,
            body: req.body,
            on: req.on.bind(req),
            removeListener: req.removeListener.bind(req),
        }, {
            requested: 1
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too many requests.", message: "Rate limit exceeded. Please try again later." })
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot access denied.", message: "Automatic requests are not allowed." })
            } else {
                return res.status(403).json({ error: "Forbidden", message: "Access denied." })
            }
        }

        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({ error: "Spoofed bot detected.", message: "Malicious bot activity detected." })
        }

        next()
    } catch (error) {
        console.error("Arcjet unavailable; allowing request (fail open):", error.message)
        next()
    }
}