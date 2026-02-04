import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { description, location } = body;

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
            return NextResponse.json({
                description: description,
                location: { name: location }
            });
        }

        const systemPrompt = `
        You are an AI assistant for a nightlife website in Israel.
        Your task is to process raw party data (description in English/Hebrew and location) and output structured Hebrew data.

        Task 1: Description Enhancement
        - The input description might be in English or poorly written Hebrew.
        - Translate it to Hebrew if needed.
        - CRITICAL: You MUST preserve all specific factual details found in the text:
            - **Lineup / Artists / DJs**: List them clearly (keep names in English if appropriate).
            - **Music Genre**: Mention the style/genre.
            - **Time**: Opening hours, set times, etc.
            - **Location**: Specific club name or area details.
        - After ensuring facts are present, rewrite the tone to be catchy, young, energetic, and "cool" (slang is okay, emojis sparingly).
        - Don't just summarize; if there is a full lineup, list it.
        - Limit the length to around 400-500 characters to accommodate the details.
        
        Task 2: Location Parsing
        - The input location is a raw string.
        - Parse it into: City, Street, Number (if available).
        - Create a unified formatted address string: "Street Number, City" (in Hebrew).
        - If the location is just a city, return just the city.
        - If the location is a famous club (e.g., "Haoman 17"), formatted should be "Haoman 17, Tel Aviv" (in Hebrew).
        - Examples:
            - Input: "Haoman 17, Tel Aviv" -> formatted: "האומן 17, תל אביב"
            - Input: "Park Hayarkon" -> formatted: "פארק הירקון, תל אביב"
            - Input: "Gagarin" -> formatted: "קיבוץ גלויות 13, תל אביב" (If you know the address of the club, use it).
        
        Output JSON Format ONLY:
        {
            "description": "The enhanced Hebrew description...",
            "location": {
                "name": "The unified formatted address (e.g. האומן 17, תל אביב)"
            }
        }
        `;

        const userContent = JSON.stringify({
            rawDescription: description,
            rawLocation: location
        });

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content || "{}";
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse Groq response", e);
            // Fallback
            return NextResponse.json({
                description: description,
                location: { name: location }
            });
        }

        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.error('Error enhancing party data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
