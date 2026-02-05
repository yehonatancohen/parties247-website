import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { Party } from "@/data/types";

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, parties } = body as { message: string, parties: Party[] };

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({
                response: "חסר לי מפתח API כדי לפעול. אנא הוסף GROQ_API_KEY לקובץ .env.local",
                suggested_party_ids: []
            });
        }

        // Simplify party data to save tokens
        const partiesContext = parties.map(p => ({
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

        let jsonResponse;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message } // Pass user message explicitly here
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 1024,
                response_format: { type: "json_object" }, // Enforce JSON
            });

            const responseText = completion.choices[0]?.message?.content || "{}";
            jsonResponse = JSON.parse(responseText);
        } catch (error: any) {
            console.warn(`Groq Chat API error:`, error.message || error);
        }

        if (!jsonResponse) {
            console.warn("Groq attempt failed. Falling back to manual search.");

            // Manual Search Logic
            const lowerMsg = message.toLowerCase();
            let filtered = parties;
            let dateFilterActive = false;

            // Date Filters
            if (lowerMsg.includes('חמישי')) {
                filtered = filtered.filter(p => p.date.startsWith(nextThursday));
                dateFilterActive = true;
            } else if (lowerMsg.includes('שישי')) {
                filtered = filtered.filter(p => p.date.startsWith(nextFriday));
                dateFilterActive = true;
            } else if (lowerMsg.includes('שבת')) {
                filtered = filtered.filter(p => p.date.startsWith(nextSaturday));
                dateFilterActive = true;
            } else if (lowerMsg.includes('היום')) {
                const today = now.toISOString().split('T')[0];
                filtered = filtered.filter(p => p.date.startsWith(today));
                dateFilterActive = true;
            } else if (lowerMsg.includes('מחר')) {
                const tmrw = new Date(now);
                tmrw.setDate(tmrw.getDate() + 1);
                const tmrwStr = tmrw.toISOString().split('T')[0];
                filtered = filtered.filter(p => p.date.startsWith(tmrwStr));
                dateFilterActive = true;
            } else if (lowerMsg.includes('סופ"ש') || lowerMsg.includes('סופש') || lowerMsg.includes('סוף שבוע')) {
                filtered = filtered.filter(p =>
                    p.date.startsWith(nextThursday) ||
                    p.date.startsWith(nextFriday) ||
                    p.date.startsWith(nextSaturday)
                );
                dateFilterActive = true;
            }

            // Content Filters (keywords)
            const keywords = ['פורים', 'אלכוהול חופשי', 'טכנו', 'טראנס', 'האוס', 'מיינסטרים', 'תל אביב', 'חיפה', 'דרום', 'צפון', 'ירושלים'];
            const queryKeywords = keywords.filter(k => lowerMsg.includes(k));

            if (queryKeywords.length > 0) {
                filtered = filtered.filter(p => {
                    const text = `${p.name} ${p.description || ''} ${p.location.name} ${p.tags.join(' ')}`.toLowerCase();
                    return queryKeywords.some(k => text.includes(k));
                });
            } else if (!dateFilterActive) {
                // If no specific date or keyword detected, try generic word match on Name/Location
                const words = lowerMsg.split(' ').filter(w => w.length > 2);
                if (words.length > 0) {
                    filtered = filtered.filter(p => {
                        const text = `${p.name} ${p.location.name}`.toLowerCase();
                        return words.some(w => text.includes(w));
                    });
                }
            }

            const top5 = filtered.slice(0, 5).map(p => p.id);

            let fallbackResponse = "המוח המלאכותי שלי קצת עמוס כרגע 🤯, אבל עשיתי חיפוש זריז ומצאתי את המסיבות האלה שאולי יתאימו:";
            if (top5.length === 0) {
                fallbackResponse = "המוח המלאכותי שלי עמוס כרגע, וגם בחיפוש הידני לא הצלחתי למצוא בדיוק את מה שחיפשת... נסה לחדד את הבקשה (תאריך, עיר או סגנון). 🕵️‍♂️";
            }

            return NextResponse.json({
                response: fallbackResponse,
                suggested_party_ids: top5
            });
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
