export const AFFILIATE_CODE = 'party247'; // Legacy - replaced by dynamic referral codes
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/parties_24.7/',
  tiktok: 'https://www.tiktok.com/@parties_24.7',
  whatsapp: 'https://wa.me/972529488077',
};
export const POPULAR_CITIES = ['תל אביב', 'חיפה', 'ירושלים', 'באר שבע'];
export const BASE_URL = 'https://www.parties247.co.il';
export const BRAND_LOGO_URL = 'https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG';
export const LAST_TICKETS_TAG = 'כרטיסים אחרונים';

// Discount code, account1 events only. GoOut doesn't confirm applying a coupon via a
// URL param (checked live — inconclusive), so this is copy-to-clipboard only, never
// auto-appended to the purchase link.
export const COUPON_CODE = 'parties24.7';
const ACCOUNT1_REFERRAL_CODE = process.env.NEXT_PUBLIC_ACCOUNT1_REFERRAL_CODE;
export const isCouponEligible = (referralCode?: string): boolean =>
  Boolean(ACCOUNT1_REFERRAL_CODE) && referralCode === ACCOUNT1_REFERRAL_CODE;