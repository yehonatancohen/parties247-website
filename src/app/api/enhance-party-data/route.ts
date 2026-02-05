import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    let body: any = {};
    try {
        body = await req.json();
        const { description, location, date, name } = body;

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
            return NextResponse.json({
                description: description,
                location: { name: location }
            });
        }

        const systemPrompt = `
        You are an expert nightlife copywriter for an Israeli party website.
        
        Task 1: Description Enhancement
        
        Rules:
        1.  **Structure**: output the description as a structured text with paragraphs separated by blank lines.
        2.  **Emojis**: Use emojis at the start of key paragraphs (🔥, 📍, ⏰, 🎧).
        3.  **Content**:
            -   **Paragraph 1 (The Hook & Vibe)**: Start with 1-2 sentences about the party vibe/genre. Make it sales-oriented ("הליין שכולם מדברים עליו...").
            -   **Paragraph 2 (Details)**: "ניפגש ב[Day] ה-[Date] במועדון [Club Name], [City]. פתיחת דלתות: [Time]."
            -   **Paragraph 3 (Lineup - CONDITIONAL)**: ONLY if specific artist names are found in the input, list them cleanly under "🎧 על העמדה:". If no artists are found, DO NOT write this section.
            -   **Paragraph 4 (Call to Action)**: "לפרטים נוספים, רכישת כרטיסים ורשימות - לחצו על הלינק למטה 👇".
        4.  **Language**: Hebrew only. Young, energetic, "Tel Avivian" style.
        5.  **Location**: Must be fully translated to Hebrew (e.g. "האומן 17, תל אביב").
        
        Task 2: Location Parsing
        - Translate the location string fully to Hebrew.
        - "Haoman 17, Tel Aviv" -> "האומן 17, תל אביב"
        
        Input Data:
        Name: ${name}
        Date: ${date}
        Location: ${location}
        Description: ${description}
        
        Output JSON Format ONLY:
        {
            "description": "The formatted Hebrew description string...",
            "location": {
                "name": "The unified Hebrew address"
            }
        }
        `;

        const userContent = JSON.stringify({
            rawDescription: description,
            rawLocation: location,
            date: date,
            name: name
        });

        try {
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
            const jsonResponse = JSON.parse(responseText);

            return NextResponse.json(jsonResponse);
        } catch (error: any) {
            console.error('Groq API error:', error);
            // Return fallback if API fails
            return NextResponse.json({
                description: description,
                location: { name: location }
            });
        }

    } catch (error) {
        console.error('Error enhancing party data:', error);
        // Return fallback using the body we captured (if available)
        // If body is empty (e.g. req.json failed), we return empty/default values which is safer than 500
        return NextResponse.json({
            description: body.description || '',
            location: { name: body.location || '' }
        });
    }
}
