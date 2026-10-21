/**
 * GoOut descriptions arrive scraped as one flat plain-text blob with the
 * promoter's links stripped, so lines like "לפרטים נוספים לחצו כאן" render as
 * dead text. Clarity (2026-09-22→24) logged 74 dead + 20 rage clicks on one
 * such description (Sukkot Thursdays Rothschild, an account1 event).
 *
 * Every pattern is an exact phrase on purpose: the text has no newlines or
 * sentence boundaries, so a "phrase through end of sentence" match would eat
 * real content.
 */

export type DescriptionMode =
  /** Upcoming event page: "more details" phrases become a jump to the buy CTA. */
  | 'purchase-link'
  /** Archive pages and plain-text (meta/JSON-LD) uses: dead phrases are removed. */
  | 'strip';

/** Id of the main CTA block on `event/[slug]`. */
export const PURCHASE_ANCHOR_ID = 'main-purchase-button';

const WA_SPELLING = 'ה?(?:וואצפ|ווצאפ|ווטסאפ|וואטסאפ|וואטאפ)';

// Promoter's own WhatsApp group invite — we don't have (and shouldn't send
// visitors to) their link, and pointing at our own group would add a fourth
// WhatsApp touchpoint, which needs owner sign-off.
const WA_GROUP = new RegExp(
  `\\s*לחצו על הקישור להצטרפות לקבוצת ${WA_SPELLING} שלנו,? שכוללת מגוון אירועים ופסטיבלים מובחרים(?: לסוכות)?:?\\s*📲\\s*(?:https?://chat\\.whatsapp\\.com/\\S+|לקבוצת ${WA_SPELLING})?`,
  'g',
);
// The same invite as recurring boilerplate lead-ins (Thursday Moon / Friday
// Mainstream / Gagarin / the free-alcohol series). Matched as whole phrases: the
// text has no sentence boundaries, so "invite through end of sentence" would eat
// real content. The URL after a phrase is optional — some feeds already lost it.
const INVITE_URL = '(?:https?://\\S+)';
const WA_JOIN = new RegExp(
  `\\s*הצטרפו לקבוצת ${WA_SPELLING} (?:\\(השקטה\\) )?ותהנו (?:מעדכונים\\s*לגבי כל האירועים מכל הז[׳']אנרים(?: בתל אביב)?|מקודי הנחה והטבות לכלל האירועים הכי מדוברים בארץ)!\\s*👇(?:🏻)?\\s*${INVITE_URL}?`,
  'g',
);
const ALL_EVENTS_JOIN = new RegExp(`\\s*\\uFEFF?להצטרפות לקבוצת ${WA_SPELLING} של כל האירועים\\s*:?\\s*${INVITE_URL}?`, 'g');
const COMMUNITY_JOIN = /\s*להצטרפות לקהילת המסיבות השקטה שלנו\s*ולכל העדכונים המעניינים\s*:\s*(?:לינק לקבוצה|לחצו כאן!?)?/g;
const PERKS_JOIN = new RegExp(
  `\\s*לגילאים, סגנון מוזיקה, קוד לבוש, סרטונים מהלוקיישן…?\\s*והטבות כי חייב לפנק אותכם\\s*כנסו לכאן\\s*👇(?:🏻)?\\s*${INVITE_URL}?`,
  'g',
);
const UPDATES_JOIN = new RegExp(
  `\\s*(?:(?:הצטרפו )?לקבוצת העדכונים שלנו לאירועים נוספים בסופ[״"]שים|לעדכונים של מסיבות כנסו לקבוצת ${WA_SPELLING}|לקבוצת האירוע הרישמית)\\s*:?\\s*\\uFEFF?${INVITE_URL}?|\\s*הצטרפו לכאן\\s*👇?(?:🏻)?\\s*${INVITE_URL}`,
  'g',
);
// Any other "join our group/community" lead-in, bounded: it must reach a colon
// or a 👇/⬇️ within 80 characters, so it can't run on into the event text.
const GENERIC_JOIN = new RegExp(
  `\\s*(?:רוצים להיות הראשונים לדעת על האירועים הבאים\\?\\s*)?(?:לפרטים נוספים ועדכונים )?(?:הצטרפו|להצטרפות) ל(?:קבוצת|קהילת)[^:👇⬇\\n]{0,80}?(?::|👇🏻?|⬇️?)\\s*(?:קישור לקבוצה|לינק לקבוצה|לחצו כאן!?)?\\s*${INVITE_URL}?`,
  'gu',
);
// Another community's pitch (they sell the same coupons we do).
const RIVAL_COMMUNITY = /\s*מאס לכם לרדוף אחרי יחצן בשביל קוד קופון\?\s*כל ההנחות והאירועים בקהילת יוצאים!(?:&nbsp;|\s)*הצטרפו\s*👇(?:🏻)?/gu;
// Contact lines that send the visitor to the promoter instead of the ticket page.
const CONTACT = /\s*(?:(?:פרטים וסגירת (?:מקומות|שולחנות)|לפרטים נוספים וסגירת שולחן שלחו לנו הודעה)\s*[-:]?\s*(?:https?:\/\/\S+|\+?972[\d -]{8,}\d|0\d[\d -]{7,}\d)|לפרטים נוספים וקוד הנחה שלחו (?:לנו )?הודעה\s*:|זמינים לכם בכל רגע נתון ב(?:ווצאפ|וואטסאפ)\s*-?\s*0\d[\d-]{7,}\d)/g;
// Whatever invite/contact link is left once the phrases above are gone. Removing
// it may leave a short "join here" lead-in behind; a dead link is still worse.
const INVITE_LINK = /\s*(?:https?:\/\/)?(?:chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com|t\.me|did\.li|katzr\.net|linktr\.ee)\/\S*/g;

// Table booking isn't ticket intent, so it's removed rather than pointed at the buy CTA.
const TABLES = /\s*לבירור וסגירת שולחנות לחצו כאן/g;

const MORE_INFO = /\s*(?:לפרטים נוספים לחצו כאן|לחץ כאן לפרטים נוספים(?: והטבות)?)/g;

const PURCHASE_LINK_HTML =
  ` <a href="#${PURCHASE_ANCHOR_ID}" class="font-medium text-link underline underline-offset-4">לפרטים נוספים ולכרטיסים</a>`;

export const cleanPartyDescription = (description: string, mode: DescriptionMode): string => {
  if (!description) return description;
  let out = description;
  for (const pattern of [WA_GROUP, WA_JOIN, ALL_EVENTS_JOIN, COMMUNITY_JOIN, PERKS_JOIN, UPDATES_JOIN, GENERIC_JOIN, RIVAL_COMMUNITY, CONTACT, INVITE_LINK, TABLES]) {
    out = out.replace(pattern, ' ');
  }
  if (mode === 'purchase-link') {
    // Only the first occurrence becomes a link; repeats of the same phrase are dropped.
    let linked = false;
    out = out.replace(MORE_INFO, () => {
      if (linked) return ' ';
      linked = true;
      return PURCHASE_LINK_HTML;
    });
  } else {
    out = out.replace(MORE_INFO, ' ');
  }
  return out.replace(/ {2,}/g, ' ').trim();
};
