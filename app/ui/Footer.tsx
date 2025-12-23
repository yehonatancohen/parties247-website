import Link from 'next/link';
import { SOCIAL_LINKS } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-jungle-surface/80 border-t border-wood-brown/50 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-jungle-text/80">
          <div className="text-center md:text-right">
            <p className="font-display text-xl text-white">Parties 24/7</p>
            <p>כל המסיבות החמות בישראל – מתעדכן כל הזמן.</p>
          </div>
          <div className="flex gap-4">
            <Link className="hover:text-white" href={SOCIAL_LINKS.instagram}>
              אינסטגרם
            </Link>
            <Link className="hover:text-white" href={SOCIAL_LINKS.tiktok}>
              טיקטוק
            </Link>
            <Link className="hover:text-white" href={SOCIAL_LINKS.whatsapp}>
              וואטסאפ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
