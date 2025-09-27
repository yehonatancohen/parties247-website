import { Party } from '../types';

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
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`Failed to fetch from proxy: ${response.statusText}`);
    
    const htmlText: string = await response.text();
    if (!htmlText) throw new Error("CORS proxy did not return content.");

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
      // FIX: Format location as an object to match the Party type.
      location: { name: eventData.Adress },
      description: description || 'No description available.',
      region: getRegion(eventData.Adress),
      musicType: getMusicType(fullText),
      eventType: getEventType(fullText),
      age: getAge(fullText, eventData.MinimumAge || 0),
      tags: getTags(fullText, eventData.Adress),
    };
    
    if (!partyDetails.slug || !partyDetails.name || !partyDetails.date || !partyDetails.location.name) {
        throw new Error("Scraped data is missing critical fields (slug, name, date, or location).");
    }

    return partyDetails;

  } catch (error) {
    console.error("Error scraping party details:", error);
    throw new Error(`Failed to process the party URL. Please check the link and network. Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const scrapePartyUrlsFromSection = (htmlText: string): string[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    const nextDataScript = doc.getElementById('__NEXT_DATA__');
    if (!nextDataScript?.textContent) {
      throw new Error("Could not find party data script (__NEXT_DATA__).");
    }
    
    const jsonData = JSON.parse(nextDataScript.textContent);
    // FIX: Updated path to find events list after website structure change.
    const events = jsonData?.props?.pageProps?.events;

    if (!Array.isArray(events)) {
      throw new Error("Events data is not in the expected format (props.pageProps.events).");
    }
    
    const partyUrls = events.map(event => {
      if (event.Url) {
        return `https://www.go-out.co/event/${event.Url}`;
      }
      return null;
    }).filter((url): url is string => url !== null);
    
    return partyUrls;
  } catch (error) {
    console.error("Error scraping section for party URLs:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to process the section page. ${errorMessage}`);
  }
};