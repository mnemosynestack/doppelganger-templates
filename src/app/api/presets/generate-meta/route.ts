import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";

const CATEGORIES = ["QA Testing", "Lead Gen", "Social Media", "Shopping", "Monitoring", "AI", "Jobs", "News", "Videos", "Reviews", "Developer Tools", "SEO", "Real Estate", "Travel", "Other"];
const MAX_REQUESTS_PER_DAY = 3;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

// In-memory IP tracking (resets on server restart/deployment)
const ipLimits = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to use the AI assistant." }, { status: 401 });
        }
        const decoded = await verifyToken(token);
        if (!decoded || !decoded.userId) { // Note jwt has sub, wait let me check auth.ts
            // Actually signToken sets { sub: user.id, username: user.username } let's just check decoded.sub
            // Oh actually the previous download/route checked decoded.userId so I might need to fix that too! Let me just check decoded.sub
        }
        if (!decoded || !decoded.sub) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to use the AI assistant." }, { status: 401 });
        }

        const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
        const genCountStr = cookieStore.get("ai_gen_limit")?.value;
        const now = Date.now();
        const isAdmin = !!process.env.ADMIN_USERNAME && decoded.username === process.env.ADMIN_USERNAME;

        let cookieCount = 0;
        let ipData = undefined;

        if (!isAdmin) {
            // 1. IP Check
            ipData = ipLimits.get(ip);
            if (ipData && now > ipData.resetAt) {
                ipData = undefined; // Expired, reset
            }
            if (ipData && ipData.count >= MAX_REQUESTS_PER_DAY) {
                return NextResponse.json({ error: "Daily limit reached for this IP." }, { status: 429 });
            }

            // 2. Cookie Check
            if (genCountStr) {
                const parsedCookie = JSON.parse(genCountStr);
                if (now < parsedCookie.resetAt) {
                    cookieCount = parsedCookie.count;
                    if (cookieCount >= MAX_REQUESTS_PER_DAY) {
                        return NextResponse.json({ error: "Daily limit reached for this browser." }, { status: 429 });
                    }
                }
            }
        }

        const { configuration } = await req.json();

        if (!configuration) {
            return NextResponse.json({ error: "Configuration is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Analyze the following JSON configuration for a web automation/scraping task.
Determine an appropriate title, a short description (1-2 sentences), and select the most fitting category from this exact list: ${CATEGORIES.join(", ")}.

Configuration:
${configuration}

Respond STRICTLY with a JSON object in this format (no markdown, no other text):
{
  "title": "A short descriptive title",
  "description": "A brief description of what this automation does",
  "category": "One of the provided categories"
}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean up markdown code blocks if the model wrapped the JSON
        if (text.startsWith("\`\`\`json")) {
            text = text.replace(/^\`\`\`json/m, "").replace(/\`\`\`$/m, "").trim();
        } else if (text.startsWith("\`\`\`")) {
            text = text.replace(/^\`\`\`/m, "").replace(/\`\`\`$/m, "").trim();
        }

        const parsed = JSON.parse(text);

        // Validate the response
        if (!parsed.title || !parsed.description || !parsed.category) {
            throw new Error("Model response missing required fields");
        }

        // Ensure category is one of the valid ones, fallback if not
        if (!CATEGORIES.includes(parsed.category)) {
            parsed.category = "QA Testing"; // Fallback
        }

        const res = NextResponse.json(parsed);

        if (!isAdmin) {
            // Increment IP
            if (ipData) {
                ipData.count += 1;
            } else {
                ipLimits.set(ip, { count: 1, resetAt: now + TWENTY_FOUR_HOURS });
            }

            // Increment Cookie
            let newCookieResetAt = now + TWENTY_FOUR_HOURS;
            if (genCountStr) {
                const parsedCookie = JSON.parse(genCountStr);
                if (now < parsedCookie.resetAt) {
                    newCookieResetAt = parsedCookie.resetAt;
                }
            }

            res.cookies.set("ai_gen_limit", JSON.stringify({ count: cookieCount + 1, resetAt: newCookieResetAt }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: new Date(newCookieResetAt)
            });
        }

        return res;

    } catch (error) {
        console.error("Error generating metadata with Gemini:", error);
        return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 });
    }
}
