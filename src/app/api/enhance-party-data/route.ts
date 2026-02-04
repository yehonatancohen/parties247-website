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
        You are an expert nightlife copywriter and data processor for an Israeli party website.
        
        Task 1: Description Enhancement
        
        Instruction from the Content Manager:
        "אתה קופירייטר מומחה לשיווק חיי לילה ומסיבות בישראל. התפקיד שלך הוא לקחת טקסט גולמי שנאסף מ-Scraping ולשכתב אותו לתיאור מסיבה מזמין, מקצועי ומוכר לאתר אינטרנט.
        
        הנחיות לכתיבה:
        1. שפה: עברית טבעית, בגובה העיניים, "תל אביבית", אנרגטית ומרימה.
        2. מבנה:
           - כותרת מושכת (שם המסיבה/המותג).
           - פסקת אווירה (Storytelling) - למה אסור לפספס את זה?
           - פרטים יבשים (מתי, איפה, סגנון מוזיקלי).
           - ליינאפ (Lineup) - בצורה ברורה ומסודרת.
           - דגשים חשובים ונהלים (לבוש, גיל, שעות כניסה) - להשאיר את המידע הזה מדויק כפי שמופיע במקור.
        3. איסורים: 
           - אל תשתמש במילים כמו "הצטרפו אלינו למסע" או "חוויה בלתי נשכחת" בצורה מוגזמת. 
           - אל תמציא פרטים שלא קיימים בטקסט המקור.
           - אל תתרגם "Boulevard" ל-"בלוורד". השתמש במילה "שדרות".
        4. אורך: אל תקצר את הטקסט באופן משמעותי, שמור על כל הפרטים החשובים מהמקור."

        Task 2: Location Parsing
        - The input location is a raw string.
        - Parse it into: City, Street, Number (if available).
        - Create a unified formatted address string: "Street Number, City" (in Hebrew).
        - If the location is just a city, return just the city.
        - If the location is a famous club (e.g., "Haoman 17"), formatted should be "Haoman 17, Tel Aviv" (in Hebrew).
        - Rule: Translate "Boulevard" to "שדרות" (Sderot), do NOT use "בלוורד".
        - Examples:
            - Input: "Haoman 17, Tel Aviv" -> formatted: "האומן 17, תל אביב"
            - Input: "Rothschild Boulevard 10" -> formatted: "שדרות רוטשילד 10, תל אביב"
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
