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

const WA_SPELLING = '(?:הוואצפ|הווצאפ|הווטסאפ|הוואטסאפ)';

// Promoter's own WhatsApp group invite — we don't have (and shouldn't send
// visitors to) their link, and pointing at our own group would add a fourth
// WhatsApp touchpoint, which needs owner sign-off.
const WA_GROUP = new RegExp(
  `\\s*לחצו על הקישור להצטרפות לקבוצת ${WA_SPELLING} שלנו,? שכוללת מגוון אירועים ופסטיבלים מובחרים(?: לסוכות)?:?\\s*📲\\s*(?:https?://chat\\.whatsapp\\.com/\\S+|לקבוצת ${WA_SPELLING})?`,
  'g',
);
// The same invite as a recurring boilerplate lead-in + raw URL (Thursday Moon /
// Friday Mainstream series). Matched as whole phrases only: stripping a bare URL
// would leave "join our group 👇" pointing at nothing, so one-off phrasings are
// left alone.
const WA_JOIN = new RegExp(
  `\\s*הצטרפו לקבוצת ${WA_SPELLING} (?:ותהנו מעדכונים לגבי כל האירועים מכל הז[׳']אנרים בתל אביב|\\(השקטה\\) ותהנו מקודי הנחה והטבות לכלל האירועים הכי מדוברים בארץ)!\\s*👇(?:🏻)?\\s*https?://chat\\.whatsapp\\.com/\\S+`,
  'g',
);

// Table booking isn't ticket intent, so it's removed rather than pointed at the buy CTA.
const TABLES = /\s*לבירור וסגירת שולחנות לחצו כאן/g;

const MORE_INFO = /\s*(?:לפרטים נוספים לחצו כאן|לחץ כאן לפרטים נוספים(?: והטבות)?)/g;

const PURCHASE_LINK_HTML =
  ` <a href="#${PURCHASE_ANCHOR_ID}" class="font-medium text-link underline underline-offset-4">לפרטים נוספים ולכרטיסים</a>`;

export const cleanPartyDescription = (description: string, mode: DescriptionMode): string => {
  if (!description) return description;
  let out = description.replace(WA_GROUP, ' ').replace(WA_JOIN, ' ').replace(TABLES, ' ');
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
