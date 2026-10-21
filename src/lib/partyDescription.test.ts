import { describe, expect, it } from 'vitest';
import { cleanPartyDescription, PURCHASE_ANCHOR_ID } from './partyDescription';

// Real scraped descriptions (fragments) from the 2026-09-24 upcoming feed.
const ROTHSCHILD =
  'THURSDAYSROTHSCHILDSUKKOT EDITION  TURSDAY NIGHT | 22:30 OPEN DOORM A I N S T R E A M לפרטים נוספים לחצו כאן';
const PORT =
  'חמישי בנמל תל אביב🏝️ לפרטים נוספים לחצו כאן לחצו על הקישור להצטרפות לקבוצת הוואצפ שלנו, שכוללת מגוון אירועים ופסטיבלים מובחרים:📲 לקבוצת הווצאפ ערב של מוזיקה טובה';
const OPEN_AIR =
  'TLV | Sukkot Edition | 25.09​ ⚠️ האירוע יתחיל החל 23:00 !⚠️ לחצו על הקישור להצטרפות לקבוצת הוואצפ שלנו, שכוללת מגוון אירועים ופסטיבלים מובחרים לסוכות:📲https://chat.whatsapp.com/Ilq7wBA0jX2L93QR73NJhB?s=cl&amp;p=i&amp;ilr=0&amp;amv=0 בלב תקופת החגים';
const TABLES =
  'לבירור וסגירת שולחנות לחצו כאן WHAT THEM GIRLS LIKE? // CHAPTER IIOMMA MARINA HERZLIYA';
const ASTRIX =
  'לחץ כאן לפרטים נוספים והטבות יש משהו בטראנס הישראלי שתמיד ידע לחצות גבולות.';

const link = `href="#${PURCHASE_ANCHOR_ID}"`;

describe('cleanPartyDescription — purchase-link mode', () => {
  it('turns the dead "more details" phrase into a jump to the buy CTA', () => {
    const out = cleanPartyDescription(ROTHSCHILD, 'purchase-link');
    expect(out).toContain(link);
    expect(out).not.toContain('לחצו כאן');
    expect(out.startsWith('THURSDAYSROTHSCHILDSUKKOT EDITION')).toBe(true);
  });

  it('removes the promoter WhatsApp-group line and keeps the text after it', () => {
    const out = cleanPartyDescription(PORT, 'purchase-link');
    expect(out).not.toMatch(/וואצפ|ווצאפ|📲/);
    expect(out).toContain(link);
    expect(out.endsWith('ערב של מוזיקה טובה')).toBe(true);
  });

  it('removes the WhatsApp invite URL without eating the following text', () => {
    const out = cleanPartyDescription(OPEN_AIR, 'purchase-link');
    expect(out).not.toContain('chat.whatsapp.com');
    expect(out).not.toContain('לחצו');
    expect(out).toContain('האירוע יתחיל החל 23:00 !⚠️');
    expect(out.endsWith('בלב תקופת החגים')).toBe(true);
  });

  it('removes the recurring "join our group 👇🏻 <url>" boilerplate as a whole', () => {
    const d =
      'FROM 22:30 ⚠️ פתיחת שערים 22:30 ⚠️ הצטרפו לקבוצת הווצאפ ותהנו מעדכונים לגבי כל האירועים מכל הז׳אנרים בתל אביב! 👇🏻https://chat.whatsapp.com/Ilq7wBA0jX2L93QR73NJhB?s=cl&amp;p=i&amp;ilr=0&amp;amv=0 MAINSTREAM';
    expect(cleanPartyDescription(d, 'purchase-link')).toBe('FROM 22:30 ⚠️ פתיחת שערים 22:30 ⚠️ MAINSTREAM');
  });

  it('drops the invite link of a one-off phrasing and keeps the text', () => {
    // We don't send visitors to a promoter's group (site survey 2026-10-21); the
    // short lead-in stays, the link goes.
    const d = 'לכל הפרטים והעדכונים👇 https://chat.whatsapp.com/abc 🌿 הלוקיישן: פארק אריאל שרון';
    expect(cleanPartyDescription(d, 'purchase-link')).toBe('לכל הפרטים והעדכונים👇 🌿 הלוקיישן: פארק אריאל שרון');
  });

  it('strips the table-booking line instead of linking it to tickets', () => {
    const out = cleanPartyDescription(TABLES, 'purchase-link');
    expect(out).toBe('WHAT THEM GIRLS LIKE? // CHAPTER IIOMMA MARINA HERZLIYA');
  });

  it('handles the "לחץ כאן לפרטים נוספים והטבות" variant', () => {
    const out = cleanPartyDescription(ASTRIX, 'purchase-link');
    expect(out).toContain(link);
    expect(out).not.toContain('והטבות');
    expect(out).toContain('יש משהו בטראנס הישראלי');
  });

  it('links only once when the phrase repeats', () => {
    const out = cleanPartyDescription(`${ROTHSCHILD} ועוד לפרטים נוספים לחצו כאן`, 'purchase-link');
    expect(out.split(link).length - 1).toBe(1);
  });

  it('leaves descriptions without dead phrases untouched', () => {
    const clean = 'Wine&amp;Co Festival 🍷| 26.9.26 | 17:00–23:00 בלי גינונים';
    expect(cleanPartyDescription(clean, 'purchase-link')).toBe(clean);
  });
});

describe('cleanPartyDescription — strip mode', () => {
  it('removes every dead phrase and never emits a link', () => {
    for (const d of [ROTHSCHILD, PORT, OPEN_AIR, TABLES, ASTRIX]) {
      const out = cleanPartyDescription(d, 'strip');
      expect(out).not.toContain('<a');
      // Not a bare "לחצו": Astrix's real text has "לחצות גבולות".
      expect(out).not.toMatch(/לחצו כאן|לחצו על|לחץ כאן|chat\.whatsapp\.com/);
    }
    expect(cleanPartyDescription(ROTHSCHILD, 'strip')).toBe(
      'THURSDAYSROTHSCHILDSUKKOT EDITION TURSDAY NIGHT | 22:30 OPEN DOORM A I N S T R E A M',
    );
  });
});

// More promoter invite/contact boilerplate from the 2026-10-21 feed (234 of 819
// descriptions carried one).
describe('cleanPartyDescription — promoter invites and contact lines', () => {
  const cases: [string, string, string][] = [
    [
      'Gagarin community',
      'להצטרפות לקהילת המסיבות השקטה שלנו ולכל העדכונים המעניינים :לינק לקבוצה GAGARIN TEL AVIVDECISION FESTIVAL 22.10 היי, זה שוב אנחנו',
      'GAGARIN TEL AVIVDECISION FESTIVAL 22.10 היי, זה שוב אנחנו',
    ],
    [
      'free-alcohol series perks',
      'שישי משתה 💃אלכוהול חופשי כל הלילה🍺 לגילאים, סגנון מוזיקה, קוד לבוש, סרטונים מהלוקיישן…והטבות כי חייב לפנק אותכםכנסו לכאן👇https://chat.whatsapp.com/B8mFswACzxy9M6YbJzHkFa?s=cl&amp;p=i&amp;ilr=1 🌠 נפגשים כל שבוע',
      'שישי משתה 💃אלכוהול חופשי כל הלילה🍺 🌠 נפגשים כל שבוע',
    ],
    [
      'quiet group + table phone',
      'מיינסטרים מול הים !הצטרפו לקבוצת הווצאפ (השקטה) ותהנו מקודי הנחה והטבות לכלל האירועים הכי מדוברים בארץ! 👇🏻https://chat.whatsapp.com/KC9qC3GCmxDEruwrKAKsMO פרטים וסגירת שולחנות -+972 50-5926987 נתראה',
      'מיינסטרים מול הים ! נתראה',
    ],
    [
      'all-events group without ה',
      'פתיחת שערים 22:30 ⚠️ להצטרפות לקבוצת וואטסאפ של כל האירועים https://did.li/ypiba כבר כמעט חודשיים',
      'פתיחת שערים 22:30 ⚠️ כבר כמעט חודשיים',
    ],
    [
      'generic lead-in stops at the colon',
      'ARAZI לפרטים נוספים ועדכונים הצטרפו לקבוצת הוואטס אפ של המסיבה:https://chat.whatsapp.com/GiuDKnUEAlL3Q5v נתראה ברחבה',
      'ARAZI נתראה ברחבה',
    ],
    [
      'bare wa.me link',
      'יש אפשרות לסגור הסעה לפרטים:wa.me/972552226297 🍾 OPEN BAR',
      'יש אפשרות לסגור הסעה לפרטים: 🍾 OPEN BAR',
    ],
  ];
  for (const [name, input, expected] of cases) {
    it(name, () => {
      expect(cleanPartyDescription(input, 'strip')).toBe(expected);
    });
  }

  it('leaves an invitation to the party itself alone', () => {
    const text = 'הצטרפו אלינו לפסטיבל ייחודי שיחגוג את ראש השנה';
    expect(cleanPartyDescription(text, 'strip')).toBe(text);
  });
});

