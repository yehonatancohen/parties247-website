import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Unicode fancy-text normalizer ───────────────────────────────────────────
// Converts Mathematical Alphanumeric Symbols (bold, fraktur, double-struck,
// script, sans-serif, monospace variants) and social-media "fancy text" back
// to plain ASCII so the AI receives clean input.

const MATH_RANGES: [number, number, number][] = [
    // [rangeStart, rangeEnd, asciiBase ('A'=65 or 'a'=97)]
    [0x1D400, 0x1D419, 65], [0x1D41A, 0x1D433, 97], // Bold A-Z / a-z
    [0x1D434, 0x1D44D, 65], [0x1D44E, 0x1D467, 97], // Italic A-Z / a-z
    [0x1D468, 0x1D481, 65], [0x1D482, 0x1D49B, 97], // Bold Italic
    [0x1D4D0, 0x1D4E9, 65], [0x1D4EA, 0x1D503, 97], // Bold Script
    [0x1D507, 0x1D50A, 68], [0x1D50D, 0x1D514, 74], // Fraktur A-G, J-Q
    [0x1D516, 0x1D51C, 83], [0x1D51E, 0x1D537, 97], // Fraktur S-Y, a-z
    [0x1D538, 0x1D539, 65], [0x1D53B, 0x1D53E, 68], // Double-struck A-B, D-G
    [0x1D540, 0x1D544, 73], [0x1D546, 0x1D546, 79], // Double-struck I-M, O
    [0x1D54A, 0x1D550, 83], [0x1D552, 0x1D56B, 97], // Double-struck S-Y, a-z
    [0x1D5A0, 0x1D5B9, 65], [0x1D5BA, 0x1D5D3, 97], // Sans-serif
    [0x1D5D4, 0x1D5ED, 65], [0x1D5EE, 0x1D607, 97], // Sans-serif Bold
    [0x1D608, 0x1D621, 65], [0x1D622, 0x1D63B, 97], // Sans-serif Italic
    [0x1D63C, 0x1D655, 65], [0x1D656, 0x1D66F, 97], // Sans-serif Bold Italic
    [0x1D670, 0x1D689, 65], [0x1D68A, 0x1D6A3, 97], // Monospace
];

const SPECIAL_MATH: Record<number, string> = {
    0x2102: 'C', 0x210D: 'H', 0x2115: 'N', 0x2119: 'P', 0x211A: 'Q',
    0x211D: 'R', 0x2124: 'Z', 0x212D: 'C', 0x210C: 'H', 0x2111: 'I',
    0x211C: 'R', 0x2128: 'Z', 0x1D504: 'A', 0x1D505: 'B',
};

function normalizeFancyText(text: string): string {
    const chars: string[] = [];
    for (const char of text) {
        const cp = char.codePointAt(0) ?? 0;
        let replaced = false;
        if (SPECIAL_MATH[cp]) {
            chars.push(SPECIAL_MATH[cp]);
            replaced = true;
        } else {
            for (const [start, end, base] of MATH_RANGES) {
                if (cp >= start && cp <= end) {
                    chars.push(String.fromCharCode(base + (cp - start)));
                    replaced = true;
                    break;
                }
            }
        }
        if (!replaced) chars.push(char);
    }
    return chars.join('');
}

// Remove lines that are purely WhatsApp/Telegram group invites or "click here" spam
function removeSpamLines(text: string): string {
    const spamPatterns = [
        /וואטסאפ/i, /whatsapp/i, /הצטרפו לקבוצ/i, /קישור לקבוצ/i,
        /לבירורים נוספים לחצו/i, /לחצו כאן/i, /t\.me\//i,
        /לשאלות זמינים/i, /לפרטים נוספים פנו/i,
    ];
    return text
        .split('\n')
        .filter(line => !spamPatterns.some(p => p.test(line)))
        .join('\n');
}

// Remove terms & conditions section — everything from the heading onwards.
// Typically headed "נהלים והנחיות", "תנאי רכישה", "תקנון", or is a block of asterisk bullets.
function removeTermsSection(text: string): string {
    const termsHeadings = [
        /^נהלים/m,
        /^תנאי /m,
        /^תנאים/m,
        /^תקנון/m,
        /^כללי הרכישה/m,
        /^הנחיות לרוכשים/m,
    ];
    for (const pattern of termsHeadings) {
        const match = text.search(pattern);
        if (match !== -1) {
            return text.substring(0, match).trimEnd();
        }
    }
    // Fallback: strip individual lines that are asterisk bullets (terms-style)
    return text
        .split('\n')
        .filter(line => !line.trim().startsWith('*'))
        .join('\n');
}

function preprocessDescription(raw: string): string {
    if (!raw) return raw;
    const normalized = normalizeFancyText(raw);
    const noTerms = removeTermsSection(normalized);
    const noSpam = removeSpamLines(noTerms);
    return noSpam.replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Code-based HTML formatter (fallback when AI is unavailable) ─────────────
// Does the same job as the AI: removes junk, formats as HTML with h2/p/ul/li.

function formatDescriptionAsHtml(cleaned: string): string {
    if (!cleaned) return '<p>לפרטים נוספים ורכישת כרטיסים לחצו על הלינק למטה</p>';

    // Remove URLs, phones, social handles
    const lines = cleaned
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/www\.[^\s]+/g, '')
        .replace(/bit\.ly\/[^\s]+/g, '')
        .replace(/(\d{2,3}[-\s]?\d{7}|\*[\d]{3,5}|1-800[-\d]+)/g, '')
        .replace(/@\w+/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 1);

    // Detect lineup section keywords
    const lineupKeywords = /^(line[- ]?up|lineup|ליין ?אפ|ליינאפ|artists?|djs?|performers?|ארטיסטים|מופיעים|set list)/i;

    const htmlParts: string[] = [];
    let inLineup = false;
    let bodyBuffer: string[] = [];

    const flushBody = () => {
        if (bodyBuffer.length > 0) {
            htmlParts.push(`<p>${bodyBuffer.join(' ')}</p>`);
            bodyBuffer = [];
        }
    };

    const flushLineup = (artists: string[]) => {
        if (artists.length > 0) {
            htmlParts.push('<ul>');
            artists.forEach(a => htmlParts.push(`<li>${a}</li>`));
            htmlParts.push('</ul>');
        }
    };

    const isHeaderLine = (line: string): boolean => {
        // Short lines, ALL-CAPS, pipe-separated, or known section patterns
        if (line.length < 60 && line.length > 1) {
            if (/^[A-Z\s.|•·\-–—&]+$/.test(line)) return true; // ALL-CAPS English
            if (line.includes('|') || line.includes('•')) return true;
            if (/^[\u0590-\u05FF\s]{2,40}$/.test(line) && !line.includes(' ש') && line.length < 30) return true;
        }
        return false;
    };

    let lineupArtists: string[] = [];

    for (const line of lines) {
        if (lineupKeywords.test(line)) {
            flushBody();
            if (lineupArtists.length > 0) flushLineup(lineupArtists);
            htmlParts.push(`<h2>${line}</h2>`);
            inLineup = true;
            lineupArtists = [];
            continue;
        }

        if (inLineup) {
            // In lineup mode: short lines are artist names, long lines end the section
            if (line.length < 80 && !line.includes('.') || /^[A-Za-z\s\-–—&()בייבי]+$/i.test(line)) {
                lineupArtists.push(line);
            } else {
                flushLineup(lineupArtists);
                lineupArtists = [];
                inLineup = false;
                // Process this line normally
                if (isHeaderLine(line)) {
                    flushBody();
                    htmlParts.push(`<h2>${line}</h2>`);
                } else {
                    bodyBuffer.push(line);
                }
            }
        } else if (isHeaderLine(line)) {
            flushBody();
            htmlParts.push(`<h2>${line}</h2>`);
        } else {
            bodyBuffer.push(line);
        }
    }

    flushBody();
    if (lineupArtists.length > 0) flushLineup(lineupArtists);

    htmlParts.push('<p>לפרטים נוספים ורכישת כרטיסים לחצו על הלינק למטה</p>');
    return htmlParts.join('');
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    let body: any = {};
    try {
        body = await req.json();
        const { rawDescription, venueName, location, date, name, musicGenres, minimumAge } = body;

        // Clean the description before anything else
        const cleanedDescription = preprocessDescription(rawDescription || body.description || '');

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing — using code-based formatter');
            return NextResponse.json({
                description: formatDescriptionAsHtml(cleanedDescription),
                location: { name: location }
            });
        }

        const systemPrompt = `You are a text cleaner for "Parties 24/7", an Israeli party aggregator website.

Your ONLY job is to take the original event description and:
1. REMOVE junk content (listed below)
2. Convert the cleaned text into HTML using ONLY <h2>, <p>, <ul>, and <li> tags
3. Extract the location

CRITICAL RULE: Do NOT rewrite, rephrase, summarize, or add ANY text. Keep the original wording EXACTLY as-is. You are a FILTER, not a writer.

═══ WHAT TO REMOVE ═══

Remove ONLY these types of content:
- URLs and hyperlinks (http://, https://, www., bit.ly, etc.)
- Phone numbers (05x, 03x, *xxxx, 1-800, etc.)
- Social media handles (@username)
- WhatsApp/Telegram group invites (הצטרפו לקבוצה, קישור לקבוצה, chat.whatsapp.com, t.me/)
- Contact lines ("לשאלות זמינים...", "לבירורים נוספים לחצו כאן", "לפרטים נוספים פנו...")
- Terms & conditions / legal sections (נהלים והנחיות, תנאי רכישה, תקנון, blocks of asterisk-prefixed lines)
- Admin notes (מנהלות, הפקה, תעודת זהות)
- Empty lines or meaningless fragments

Keep EVERYTHING else exactly as written in the original.

═══ HTML FORMATTING RULES ═══

1. Use <h2> for title/header-like lines: short lines, ALL-CAPS text, pipe-separated titles (e.g. "ART. MUSIC. PEOPLE."), brand/organizer names, section headings.
2. Use <p> for regular body text — group consecutive body lines into a single <p>.
3. LINEUP: If the description has a lineup section (identified by "Line up", "Lineup", "ליין אפ", "ליינאפ", "Artists", "DJs", etc.), format artist names as:
   <h2>ליין אפ</h2>
   <ul>
     <li>Artist Name</li>
   </ul>
4. The LAST element must always be exactly:
   <p>לפרטים נוספים ורכישת כרטיסים לחצו על הלינק למטה</p>
5. No classes, no attributes, no inline styles. Only <h2>, <p>, <ul>, <li>.

═══ LOCATION RULES ═══

1. Venue name (from go-out.co): ${venueName || 'not provided'}
2. Full address (from go-out.co): ${location}
3. Extract the CITY from the address string:
   - "Tel Aviv-Yafo" or "Tel-Aviv" or "Tel Aviv" → "תל אביב"
   - "Haifa" → "חיפה"
   - "Jerusalem" → "ירושלים"
   - "Eilat" → "אילת"
   - "Beer Sheva" or "Be'er Sheva" → "באר שבע"
   - "Rishon LeZion" or "Rishon Lezion" → "ראשון לציון"
   - "Netanya" → "נתניה"
   - "Herzliya" → "הרצליה"
4. Format the output location as: "[venue name], [Hebrew city]"
   - If venue name is provided: use it as-is.
   - If no venue name: derive a short name from the address or the event name.
5. Strip "Israel", "Israël", and country/postal suffixes from the result.

═══ INPUT ═══

Event Name: ${name}
Date: ${date}
Venue Name: ${venueName || 'N/A'}
Full Address: ${location}
Music Genres: ${musicGenres || 'N/A'}
Minimum Age: ${minimumAge || 'N/A'}

Original Description:
---
${cleanedDescription || 'No description provided'}
---

═══ OUTPUT ═══

Return a JSON object with exactly these keys:
{
  "description": "<h2>...</h2><p>original text here exactly as written...</p>...<p>לפרטים נוספים ורכישת כרטיסים לחצו על הלינק למטה</p>",
  "location": {
    "name": "venue name, Hebrew city"
  }
}`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Clean the description by removing junk only. Keep all original text. Return JSON." }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.2,
                max_tokens: 8192,
                response_format: { type: "json_object" },
            });

            const responseText = completion.choices[0]?.message?.content || "{}";
            const jsonResponse = JSON.parse(responseText);

            // Validate the response has the expected shape
            if (!jsonResponse.description || !jsonResponse.location?.name) {
                console.warn('AI returned incomplete data, using code-based fallback');
                return NextResponse.json({
                    description: formatDescriptionAsHtml(cleanedDescription),
                    location: { name: location }
                });
            }

            // Clean up any extra blank lines the AI might add
            jsonResponse.description = jsonResponse.description
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            return NextResponse.json(jsonResponse);
        } catch (error: any) {
            // Groq sometimes rejects valid content because the AI's HTML has
            // unescaped quotes that break JSON validation. The actual content
            // is still available in the error's failed_generation field — try to
            // recover it before falling back.

            // The Groq SDK nests the error in various ways depending on the version
            const failedGen = error?.error?.failed_generation
                || error?.error?.error?.failed_generation
                || error?.response?.body?.error?.failed_generation;

            // Also try to extract from the error message string itself
            let failedGenStr = failedGen;
            if (!failedGenStr && error?.message) {
                const msgMatch = error.message.match(/"failed_generation"\s*:\s*"([\s\S]+?)"\s*}\s*}\s*$/);
                if (msgMatch) {
                    failedGenStr = msgMatch[1]
                        .replace(/\\"/g, '"')
                        .replace(/\\n/g, '\n')
                        .replace(/\\\\/g, '\\');
                }
            }

            if (failedGenStr) {
                try {
                    // Try direct parse first
                    const recovered = JSON.parse(failedGenStr);
                    if (recovered.description && recovered.location?.name) {
                        console.log('Recovered description from failed_generation (direct parse)');
                        recovered.description = recovered.description.replace(/\n{3,}/g, '\n\n').trim();
                        return NextResponse.json(recovered);
                    }
                } catch {
                    // Direct parse failed — try to extract HTML description via regex
                    try {
                        const descMatch = failedGenStr.match(/<h2>[\s\S]*<\/p>/);
                        const locMatch = failedGenStr.match(/"name"\s*:\s*"([^"]+)"/);
                        if (descMatch) {
                            const desc = descMatch[0]
                                .replace(/\\n/g, '')
                                .replace(/\n/g, '')
                                .replace(/\\"/g, '"')
                                .trim();
                            const locName = locMatch ? locMatch[1] : location;
                            console.log('Recovered description via regex from failed_generation');
                            return NextResponse.json({
                                description: desc,
                                location: { name: locName }
                            });
                        }
                    } catch {
                        // regex recovery also failed
                    }
                }
            }

            // Rate limit or other unrecoverable error — use code-based fallback
            console.warn('Groq API unavailable, using code-based formatter:', error?.status || error?.message);
            return NextResponse.json({
                description: formatDescriptionAsHtml(cleanedDescription),
                location: { name: location }
            });
        }

    } catch (error) {
        console.error('Error enhancing party data:', error);
        const fallbackDesc = body.rawDescription || body.description || '';
        return NextResponse.json({
            description: formatDescriptionAsHtml(preprocessDescription(fallbackDesc)),
            location: { name: body.location || '' }
        });
    }
}
