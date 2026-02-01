import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { Party } from "@/data/types";

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, parties } = body;

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({
                response: "חסר לי מפתח API כדי לפעול. אנא הוסף GROQ_API_KEY לקובץ .env.local",
                suggested_party_ids: []
            });
        }

        // Simplify party data to save tokens
        const partiesContext = (parties as Party[]).map(p => ({
            id: p.id,
            name: p.name,
            genre: p.musicGenres,
            location: p.location.name,
            city: p.location.address,
            date: p.date,
            description: p.description ? p.description.substring(0, 100) + "..." : "",
            tags: p.tags,
            price_info: "Check link"
        })).map(p => JSON.stringify(p)).join("\n");

        // Calculate dates for context
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];
        const todayDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY

        // Calculate upcoming Thursday, Friday, Saturday
        const getNextDay = (dayIndex: number) => {
            const d = new Date();
            d.setDate(d.getDate() + ((dayIndex + 7 - d.getDay()) % 7));
            return d.toISOString().split('T')[0];
        };

        const nextThursday = getNextDay(4); // 4 = Thursday
        const nextFriday = getNextDay(5);
        const nextSaturday = getNextDay(6);

        const systemPrompt = `
        You are "מסיבוט" (Messibot), a fun, energetic, and helpful party assistant for the "Parties247" website.
        Your goal is to help users find parties from the provided list or answer questions.
        
        Personality:
        - Speak Hebrew only (unless asked otherwise).
        - Be cool and young.
        - Use emojis sparingly (standard iOS style if possible), don't overdo it.
        - Don't be too formal.
        
        Current Time Context:
        - Today is: ${dayName}, ${todayDate} (${now.toISOString()}).
        - Upcoming Thursday is: ${nextThursday}
        - Upcoming Friday is: ${nextFriday}
        - Upcoming Saturday is: ${nextSaturday}
        
        Data:
        Here is the list of upcoming parties in JSON format:
        [
        ${partiesContext}
        ]

        Instructions:
        1. Analyze the user's request ("${message}").
        2. Filter the parties that match the request (by genre, location, date, or vibe).
        3. DATE MATCHING IS CRITICAL: 
           - If user asks for "Thursday", ONLY return parties happening on ${nextThursday}.
           - If user asks for "Friday", ONLY return parties happening on ${nextFriday}.
           - If user asks for "Weekend", return parties on ${nextThursday}, ${nextFriday}, or ${nextSaturday}.
           - If user asks for "Today", compare with ${now.toISOString().split('T')[0]}.
        4. Construct a helpful response.
        5. Limit "suggested_party_ids" to a MAXIMUM of 5 items.
        6. IMPORTANT: You must output PURE JSON. Do not write markdown.
        
        Output Schema:
        {
            "response": "Your textual response here...",
            "suggested_party_ids": ["id_of_party_1", "id_of_party_2"]
        }

        If you don't find any parties, "suggested_party_ids" should be empty array [], and explain nicely.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message } // Pass user message explicitly here
            ],
            model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B (closest to 'oss 120b' intent)
            temperature: 0.5,
            max_tokens: 1024,
            response_format: { type: "json_object" }, // Enforce JSON
        });

        const responseText = completion.choices[0]?.message?.content || "{}";

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", responseText);
            jsonResponse = {
                response: "אופס, קצת הסתבכתי עם המחשבות... 😵 נסה שוב?",
                suggested_party_ids: []
            };
        }

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({
            response: "מסיבוט נתקל בבעיה טכנית. 🤖🔧",
            suggested_party_ids: []
        }, { status: 500 });
    }
}
