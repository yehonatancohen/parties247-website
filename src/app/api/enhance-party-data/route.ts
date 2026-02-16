import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    let body: any = {};
    try {
        body = await req.json();
        const { rawDescription, location, date, name, musicGenres, minimumAge } = body;

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing — returning raw data');
            return NextResponse.json({
                description: rawDescription || body.description,
                location: { name: location }
            });
        }

        const systemPrompt = `You are an expert nightlife copywriter for an Israeli party aggregator website called "Parties 24/7".

Your job is to take RAW scraped event data and produce a clean, attractive, Hebrew description and a properly formatted Hebrew location string.

═══ DESCRIPTION RULES ═══

1. Output ONLY the final description text (no JSON wrapping inside the description value).
2. Write in Hebrew. Use a young, energetic, "Tel Avivian" tone.
3. NO excessive blank lines — use exactly ONE blank line between paragraphs.
4. Structure:
   a) **Hook** (1-2 sentences): What makes this party special. Be sales-oriented.
   b) **Details line**: "📍 [venue name], [city] | ⏰ [day], [date] | [time]"
   c) **Lineup** (ONLY if artist/DJ names exist in the input): "🎧 Line Up:" followed by the names, each on its own line. If NO specific names are found, SKIP this section entirely.
   d) **Age/entry info** (if available): age limit, dress code, etc.
   e) **CTA**: "לפרטים נוספים ורכישת כרטיסים לחצו על הלינק למטה 👇"
5. REMOVE: URLs, phone numbers, social media handles, promotional spam, "Empty heading", duplicate information, admin notes (e.g. "מנהלות אירוע", "תעודת זהות").
6. Keep the description concise — max ~150 words.
7. Do NOT invent information that isn't in the raw data.

═══ LOCATION RULES ═══

1. Translate the location fully to Hebrew.
2. Format: "[venue name], [city]" (e.g. "האומן 17, תל אביב")
3. Remove "Israel", "Israël", duplicate city names.
4. Common translations: "Haoman 17" → "האומן 17", "Tel Aviv" → "תל אביב", "Haifa" → "חיפה", "Jerusalem" → "ירושלים"
5. If the location contains a street address AND a venue name, prefer: "[venue], [city]"

═══ INPUT DATA ═══

Name: ${name}
Date: ${date}
Location: ${location}
Music Genres: ${musicGenres || 'N/A'}
Minimum Age: ${minimumAge || 'N/A'}

Raw Description:
---
${rawDescription || body.description || 'No description provided'}
---

═══ OUTPUT ═══

Return a JSON object with exactly these keys:
{
  "description": "The formatted Hebrew description...",
  "location": {
    "name": "Hebrew venue, city"
  }
}`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Parse and enhance the event data above. Return JSON only." }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.4,
                max_tokens: 1024,
                response_format: { type: "json_object" },
            });

            const responseText = completion.choices[0]?.message?.content || "{}";
            const jsonResponse = JSON.parse(responseText);

            // Validate the response has the expected shape
            if (!jsonResponse.description || !jsonResponse.location?.name) {
                console.warn('AI returned incomplete data, using fallback');
                return NextResponse.json({
                    description: rawDescription || body.description,
                    location: { name: location }
                });
            }

            // Clean up any extra blank lines the AI might add
            jsonResponse.description = jsonResponse.description
                .replace(/\n{3,}/g, '\n\n')  // collapse 3+ newlines to 2
                .trim();

            return NextResponse.json(jsonResponse);
        } catch (error: any) {
            console.error('Groq API error:', error);
            return NextResponse.json({
                description: rawDescription || body.description,
                location: { name: location }
            });
        }

    } catch (error) {
        console.error('Error enhancing party data:', error);
        return NextResponse.json({
            description: body.description || body.rawDescription || '',
            location: { name: body.location || '' }
        });
    }
}
