
import { Party } from '../data/types';

// FIX: Align Omit with the actual Party type and remove non-existent properties.
type ScrapedPartyDetails = Omit<Party, 'id' | 'originalUrl' | 'referralCode' | 'eventStatus' | 'eventAttendanceMode' | 'organizer' | 'performer'>;

// --- Classification Helpers ---

const getRegion = (location: string): Party['region'] => {
  const southKeywords = ['באר שבע', 'אילת', 'אשדוד', 'אשקלון', 'דרום', 'beer sheva', 'eilat', 'ashdod', 'ashkelon'];
  const northKeywords = ['חיפה', 'טבריה', 'צפון', 'קריות', 'כרמיאל', 'עכו', 'haifa', 'tiberias', 'north'];
  const centerKeywords = ['תל אביב', 'ירושלים', 'ראשון לציון', 'הרצליה', 'נתניה', 'מרכז', 'י-ם', 'tel aviv', 'tlv', 'jerusalem', 'rishon lezion', 'herzliya', 'netanya'];

  const loc = location.toLowerCase();
  if (southKeywords.some(k => loc.includes(k))) return 'דרום';
  if (northKeywords.some(k => loc.includes(k))) return 'צפון';
  if (centerKeywords.some(k => loc.includes(k))) return 'מרכז';

  return 'לא ידוע';
};

const translateLocation = (location: string): string => {
  let loc = location;
  const cityMap: Record<string, string> = {
    'Tel Aviv': 'תל אביב',
    'Tel-Aviv': 'תל אביב',
    'Tel aviv': 'תל אביב',
    'Eilat': 'אילת',
    'Haifa': 'חיפה',
    'Jerusalem': 'ירושלים',
    'Rishon Lezion': 'ראשון לציון',
    'Herzliya': 'הרצליה',
    'Beer Sheva': 'באר שבע',
    'Ashdod': 'אשדוד',
    'Ashkelon': 'אשקלון',
    'Netanya': 'נתניה',
  };

  Object.entries(cityMap).forEach(([eng, heb]) => {
    // Replace exact city name or city name at end of string
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    loc = loc.replace(regex, heb);
  });
  return loc;
};

const getMusicType = (text: string): Party['musicType'] => {
  const technoKeywords = ['טכנו', 'techno', 'after', 'אפטר', 'house', 'האוס', 'electronic', 'אלקטרונית'];
  const tranceKeywords = ['טראנס', 'trance', 'פסיי', 'psy-trance', 'psytrance'];
  const mainstreamKeywords = ['מיינסטרים', 'mainstream', 'היפ הופ', 'hip hop', 'רגאטון', 'reggaeton', 'pop', 'פופ'];

  const txt = text.toLowerCase();
  if (technoKeywords.some(k => txt.includes(k))) return 'טכנו';
  if (tranceKeywords.some(k => txt.includes(k))) return 'טראנס';
  if (mainstreamKeywords.some(k => txt.includes(k))) return 'מיינסטרים';
  return 'אחר';
};

const getEventType = (text: string): Party['eventType'] => {
  const festivalKeywords = ['פסטיבל', 'festival'];
  const natureKeywords = ['טבע', 'nature', 'יער', 'forest', 'חוף', 'beach', 'open air', 'בחוץ'];
  const clubKeywords = ['מועדון', 'club', 'גגרין', 'בלוק', 'האומן 17', 'gagarin', 'block', 'haoman 17', 'rooftop', 'גג'];

  const txt = text.toLowerCase();
  if (festivalKeywords.some(k => txt.includes(k))) return 'פסטיבל';
  if (natureKeywords.some(k => txt.includes(k))) return 'מסיבת טבע';
  if (clubKeywords.some(k => txt.includes(k))) return 'מסיבת מועדון';
  return 'אחר';
};

const getAge = (text: string, minimumAge: number): Party['age'] => {
  if (minimumAge >= 21) return '21+';
  if (minimumAge >= 18) return '18+';
  if (text.toLowerCase().includes('נוער')) return 'נוער';
  if (minimumAge > 0) return '18+'; // Default for any age limit
  return 'כל הגילאים';
};

const getTags = (text: string, location: string): string[] => {
  const tags: string[] = [];
  const tagMap: { [key: string]: string[] } = {
    'אלכוהול חופשי': ['אלכוהול חופשי', 'free alcohol', 'בר חופשי', 'free bar'],
    'בחוץ': ['open air', 'בחוץ', 'טבע', 'חוף', 'יער', 'rooftop', 'גג'],
    'אילת': ['אילת', 'eilat'],
    'תל אביב': ['תל אביב', 'tel aviv', 'tlv'],
  };

  const combinedText = (text + ' ' + location).toLowerCase();
  for (const tag in tagMap) {
    if (tagMap[tag].some(keyword => combinedText.includes(keyword))) {
      tags.push(tag);
    }
  }
  return [...new Set(tags)]; // Return unique tags
};

// --- Main Scraping Function ---

export const scrapePartyDetails = async (url: string): Promise<ScrapedPartyDetails> => {
  // List of CORS proxy services to try in order
  const proxyConfigs = [
    {
      name: 'AllOrigins',
      getUrl: (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      parseResponse: async (response: Response) => await response.text()
    },
    {
      name: 'proxy.cors.sh',
      getUrl: (targetUrl: string) => `https://proxy.cors.sh/${targetUrl}`,
      parseResponse: async (response: Response) => await response.text()
    },
    {
      name: 'corsproxy.io',
      getUrl: (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      parseResponse: async (response: Response) => await response.text()
    }
  ];

  let lastError: Error | null = null;
  let htmlText = '';

  // Try each proxy in sequence until one succeeds
  for (const proxy of proxyConfigs) {
    try {
      const proxyUrl = proxy.getUrl(url);
      console.log(`Attempting to fetch via ${proxy.name}...`);

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`${proxy.name} returned status ${response.status}: ${response.statusText}`);
      }

      htmlText = await proxy.parseResponse(response);
      if (!htmlText || htmlText.trim().length === 0) {
        throw new Error(`${proxy.name} returned empty content`);
      }

      console.log(`Successfully fetched via ${proxy.name}`);
      break; // Success, exit the loop
    } catch (error) {
      console.warn(`Failed to fetch via ${proxy.name}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next proxy
    }
  }

  // If all proxies failed, throw the last error
  if (!htmlText) {
    throw new Error(`All proxy services failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const nextDataScript = doc.getElementById('__NEXT_DATA__');
    if (!nextDataScript?.textContent) throw new Error("Could not find party data script.");

    const jsonData = JSON.parse(nextDataScript.textContent);
    const eventData = jsonData?.props?.pageProps?.event;
    if (!eventData) throw new Error("Event data not in expected format.");

    let imageUrl = '';
    let imagePath = '';

    // Priority 1: Use CoverImage.Url from JSON data
    if (eventData.CoverImage?.Url) {
      imagePath = eventData.CoverImage.Url;
    }
    // Priority 2: Use WhatsappImage.Url from JSON data if CoverImage is missing
    else if (eventData.WhatsappImage?.Url) {
      imagePath = eventData.WhatsappImage.Url;
    }

    // If we got a path from JSON, ensure it's the cover image version
    if (imagePath) {
      const coverImagePath = imagePath.replace('_whatsappImage.jpg', '_coverImage.jpg');
      imageUrl = `https://d15q6k8l9pfut7.cloudfront.net/${coverImagePath}`;
    } else {
      // Priority 3: Fallback to og:image meta tag
      const imageMeta = doc.querySelector('meta[property="og:image"]');
      const ogImageUrl = imageMeta?.getAttribute('content') || '';
      if (ogImageUrl) {
        // Also try to upgrade it to the cover image version
        imageUrl = ogImageUrl.replace('_whatsappImage.jpg', '_coverImage.jpg');
      }
    }

    if (!imageUrl) throw new Error("Could not find party image URL.");

    let description = (eventData.Description || '').split('\n').filter(Boolean).slice(0, 3).join(' ').trim();
    if (description.length > 250) description = description.substring(0, 247) + '...';

    const fullText = `${eventData.Title} ${eventData.Description}`;

    const partyDetails: ScrapedPartyDetails = {
      // FIX: Add slug property which is required by ScrapedPartyDetails.
      slug: eventData.Url,
      name: eventData.Title,
      imageUrl: imageUrl,
      date: eventData.StartingDate,
      musicGenres: eventData.MusicGenres || 'אחר',
      location: { name: eventData.Adress },
      description: description || 'No description available.',
      region: getRegion(eventData.Adress),
      musicType: getMusicType(fullText),
      eventType: getEventType(fullText),
      age: getAge(fullText, eventData.MinimumAge || 0),
      tags: getTags(fullText, eventData.Adress),
    };

    // --- MANUAL ENHANCEMENT STEP (No AI) ---

    // 1. Clean Location
    let cleanLocation = eventData.Adress || '';
    // Remove "Israel", "Israël", "ישראל" case insensitive
    cleanLocation = cleanLocation
      .replace(/,?\s*Israël/gi, '')
      .replace(/,?\s*Israel/gi, '')
      .replace(/,?\s*ישראל/gi, '');

    cleanLocation = cleanLocation.replace(/Boulevard/gi, 'שדרות');
    cleanLocation = cleanLocation.trim();
    // Remove duplication if city appears at end (e.g. "Tel-Aviv, Tel-Aviv")
    const cityMatch = cleanLocation.match(/,\s*([^,]+)$/);
    if (cityMatch) {
      const city = cityMatch[1];
      const rest = cleanLocation.substring(0, cleanLocation.lastIndexOf(','));
      if (rest.trim().endsWith(city.trim())) {
        cleanLocation = rest.trim();
      }
    }

    partyDetails.location.name = translateLocation(cleanLocation);
    partyDetails.region = getRegion(partyDetails.location.name);

    // 2. Format Description & extract details
    let rawDescription = eventData.Description || '';

    // 2.1 Basic cleanup - decode HTML entities first!
    rawDescription = rawDescription
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/Empty heading/gi, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+/g, ' ');

    const lines = rawDescription.split('\n').map(l => l.trim());

    // Keywords to detect sections
    const lineupKeywords = ['LINE UP', 'LINE-UP', 'על העמדה', 'ליינאפ'];
    const adminKeywords = [
      'דגשים', 'חשוב', 'מנהלות', 'כניסה', 'תעודת זהות', 'הפקה', 'מזמין כרטיס',
      'קוד לבוש', 'גילאים', 'פיקוד העורף', 'לאינסטגרם', 'ווצאפ', 'וואצפ', 'וואטסאפ',
      'whatsapp', 'instagram', 'קישור', 'הצטרפות', 'לפרטים', 'כרטיסים',
      'מוזמנים בלבד', 'אירוע חברי', 'זמינים לכם', '052', '050', '054', '053'
    ];

    // Garbage heuristics for headers (e.g. "THURSDAY ...")
    // If a line is all UPPERCASE English, it's likely a generic header. 
    // Or if it contains specific spammy content from the platform.
    const garbageKeywords = ['THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'JIMMY WHO'];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const phoneRegex = /(\d{3}[-\s]?\d{7}|\d{2}[-\s]?\d{7}|\*[\d]{3,5})/;

    const capturedBody: string[] = [];
    const capturedLineup: string[] = [];
    let isLineup = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.length < 2) continue;

      // Skip separator lines
      if (line.match(/^[-—_]+$/)) continue;

      // Skip lines with URLs
      if (urlRegex.test(line)) continue;

      // Explicit phone check
      if (phoneRegex.test(line)) continue;

      const lowerLine = line.toLowerCase();

      // Check for Lineup Header
      if (lineupKeywords.some(k => lowerLine.includes(k.toLowerCase()))) {
        isLineup = true;
        capturedLineup.push("Line Up"); // Normalized header
        continue;
      }

      if (isLineup) {
        // Stop if we hit admin keywords or significant Hebrew text that looks like a new paragraph
        if (adminKeywords.some(k => lowerLine.includes(k)) || line.length > 60) {
          isLineup = false;
        } else {
          capturedLineup.push(line);
          continue;
        }
      }

      // Body Processing
      if (adminKeywords.some(k => lowerLine.includes(k))) {
        continue;
      }

      // Garbage Filter
      if (garbageKeywords.some(k => line.includes(k))) {
        // If the line is short or mostly english/symbols, skip it.
        // But if it has Hebrew, keep it.
        const hasHebrew = /[\u0590-\u05FF]/.test(line);
        if (!hasHebrew) continue;
      }

      const isHebrew = /[\u0590-\u05FF]/.test(line);

      // Keep Hebrew lines that are not admin
      if (isHebrew) {
        capturedBody.push(line);
      } else {
        // Include English lines if they are substantial (likely content)
        // Reduced threshold to 30 to be safer
        if (line.length > 30) {
          capturedBody.push(line);
        }
      }
    }

    // Format Date nicely
    const dateObj = new Date(eventData.StartingDate);
    const dateStr = dateObj.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr = dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    let intro = capturedBody.join('\n\n').trim();

    // Fallback: If "Smart" parsing failed to find any body text, revert to a simpler extraction
    if (!intro) {
      const fallbackLines = lines.filter(l =>
        l.length > 0 &&
        !l.match(/^[-—_]+$/) &&
        !urlRegex.test(l) &&
        !adminKeywords.some(k => l.toLowerCase().includes(k))
      );
      // Take first 5 non-empty, non-admin lines
      intro = fallbackLines.slice(0, 5).join('\n\n').trim();
    }

    if (!intro) intro = "לפרטים נוספים כנסו ללינק הכרטיסים";

    let enhancedDescription = `${intro}

📍 מיקום: ${partyDetails.location.name}
⏰ מתי: ${dateStr}, ${timeStr}`;

    if (capturedLineup.length > 0) {
      // Check if "Line Up" is the first item, if so use a nice header
      const hasHeader = capturedLineup[0] === "Line Up";
      const lineupList = hasHeader ? capturedLineup.slice(1).join('\n') : capturedLineup.join('\n');

      enhancedDescription += `\n\n🎧 ${hasHeader ? 'Line Up' : 'על העמדה'}:\n${lineupList}`;
    }

    partyDetails.description = enhancedDescription;

    // ----------------------------------------
    // AI ENHANCEMENT STEP (Call the API)
    // ----------------------------------------
    try {
      const response = await fetch('/api/enhance-party-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: partyDetails.description,
          location: partyDetails.location.name,
          date: partyDetails.date,
          name: partyDetails.name,
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        if (aiData.description) {
          partyDetails.description = aiData.description;
        }
        if (aiData.location?.name) {
          partyDetails.location.name = aiData.location.name;
          partyDetails.region = getRegion(partyDetails.location.name); // Re-calculate region
        }
        // Re-evaluate tags based on new content from AI
        const newFullText = `${partyDetails.name} ${partyDetails.description} ${partyDetails.location.name}`;
        partyDetails.tags = getTags(newFullText, partyDetails.location.name);
      } else {
        console.warn("AI Enhancement API failed, keeping original data.");
      }
    } catch (apiError) {
      console.warn("Retrying AI Enhancement failed:", apiError);
    }

    if (!partyDetails.slug || !partyDetails.name || !partyDetails.date || !partyDetails.location.name) {
      throw new Error("Scraped data is missing critical fields (slug, name, date, or location).");
    }

    return partyDetails;

  } catch (error) {
    console.error("Error scraping party details:", error);
    throw new Error(`Failed to process the party URL. Please check the link and network. Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};
