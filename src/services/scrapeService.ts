
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

const getTicketPrice = (html: string): number | undefined => {
  const priceMatch = html.match(/החל מ\s*-?\s*(\d+)/);
  if (priceMatch && priceMatch[1]) {
    return parseInt(priceMatch[1], 10);
  }
  return undefined;
};

// --- Manual Description Builder (Fallback when AI is unavailable) ---

const buildManualDescription = (rawDesc: string, locationName: string, startingDate: string): string => {
  // Basic cleanup
  let cleaned = rawDesc
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/Empty heading/gi, '')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+/g, ' ');

  const lines = cleaned.split('\n').map((l: string) => l.trim()).filter(Boolean);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const phoneRegex = /(\d{3}[-\s]?\d{7}|\d{2}[-\s]?\d{7}|\*[\d]{3,5})/;
  const adminKeywords = [
    'דגשים', 'חשוב', 'מנהלות', 'כניסה', 'תעודת זהות', 'הפקה',
    'whatsapp', 'instagram', '052', '050', '054', '053'
  ];

  const cleanLines = lines.filter((line: string) => {
    if (line.length < 2) return false;
    if (line.match(/^[-—_]+$/)) return false;
    if (urlRegex.test(line)) return false;
    if (phoneRegex.test(line)) return false;
    if (adminKeywords.some(k => line.toLowerCase().includes(k))) return false;
    return true;
  });

  let intro = cleanLines.slice(0, 8).join('\n').trim();
  if (!intro) intro = "לפרטים נוספים כנסו ללינק הכרטיסים";

  const dateObj = new Date(startingDate);
  const dateStr = dateObj.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  return `${intro}\n\n📍 מיקום: ${locationName}\n⏰ מתי: ${dateStr}, ${timeStr}`;
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
      ticketPrice: getTicketPrice(htmlText),
    };

    // ════════════════════════════════════════════════════════════
    // AI-FIRST ENHANCEMENT: Send RAW data to AI, fallback to manual
    // ════════════════════════════════════════════════════════════

    const rawDescription = eventData.Description || '';

    try {
      const response = await fetch('/api/enhance-party-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription: rawDescription,
          location: eventData.Adress || '',
          date: eventData.StartingDate,
          name: eventData.Title,
          musicGenres: eventData.MusicGenres || '',
          minimumAge: eventData.MinimumAge || 0,
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        if (aiData.description) {
          partyDetails.description = aiData.description;
        }
        if (aiData.location?.name) {
          partyDetails.location.name = aiData.location.name;
          partyDetails.region = getRegion(partyDetails.location.name);
        }
        // Re-evaluate tags with AI-enhanced content
        const newFullText = `${partyDetails.name} ${partyDetails.description} ${partyDetails.location.name}`;
        partyDetails.tags = getTags(newFullText, partyDetails.location.name);
      } else {
        console.warn("AI Enhancement API returned non-ok status, falling back to manual parsing.");
        partyDetails.description = buildManualDescription(rawDescription, partyDetails.location.name, eventData.StartingDate);
      }
    } catch (apiError) {
      console.warn("AI Enhancement failed, using manual fallback:", apiError);
      partyDetails.description = buildManualDescription(rawDescription, partyDetails.location.name, eventData.StartingDate);
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
