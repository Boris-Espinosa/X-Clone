import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node"
import { ENV } from "./env.js"

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src"],
    
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: [
                "X-Clone-Moblie/1.0.0",
                "X-Clone-Mobile/*",
                "okhttp/*",
                "CFNetwork/*",
                "CATEGORY:SEARCH_ENGINE",
            ],
            block: ["AUTOMATED", "WEB_SCRAPER"]
        }),

        tokenBucket({
            mode: "LIVE",
            refillRate: 10,
            interval: 10,
            capacity: 15,
        }),
    ],
})
