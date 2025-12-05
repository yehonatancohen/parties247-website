
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParties } from '../hooks/useParties';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyCarousel from '../components/HotEventsCarousel';
import SocialsCta from '../components/SocialsCta';
import { BASE_URL, SOCIAL_LINKS } from '../constants';
import { createCarouselSlug } from '../lib/carousels';

const HERO_POSTER_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

const HomePage: React.FC = () => {
  const { parties, carousels, isLoading, error, loadingMessage } = useParties();

  const pageTitle = 'מסיבות בתל אביב | Parties247';
  const pageDescription = 'כל המסיבות הכי חמות בישראל – תל אביב, חיפה, אילת ועוד. Parties247 היא פלטפורמת המסיבות של ישראל.';

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Parties 24/7',
    'url': BASE_URL,
    'logo': 'https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG',
    'sameAs': [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.whatsapp,
    ],
    'areaServed': {
      '@type': 'Country',
      'name': 'IL',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Parties 24/7',
    'url': BASE_URL,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${BASE_URL}/all-parties?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fallbackTimeout = window.setTimeout(() => {
      if (!videoLoaded) {
        setVideoFailed(true);
      }
    }, 3500);

    return () => window.clearTimeout(fallbackTimeout);
  }, [videoLoaded]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <LoadingSpinner />
        {loadingMessage && <p className="text-jungle-accent mt-4 animate-pulse">{loadingMessage}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
        <p className="text-red-300/80 mt-2">{error}</p>
      </div>
    );
  }
  
  const carouselsWithParties = carousels.map(carousel => {
    const carouselParties = parties.filter(p => carousel.partyIds.includes(p.id));
    return {
      ...carousel,
      parties: carouselParties,
      viewAllLink: `/carousels/${createCarouselSlug(carousel.title)}`,
    };
  }).filter(c => c.parties.length > 0);

  return (
    <>
      <SeoManager
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/"
        jsonLd={[organizationJsonLd, websiteJsonLd]}
      />

      <div className="relative text-center mb-12 -mt-8 h-[70vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        {videoFailed ? (
          <img
            src={HERO_POSTER_DATA_URL}
            alt="Tropical party"
            className="absolute z-0 w-full h-full object-cover brightness-[0.6]"
            loading="lazy"
          />
        ) : (
          <video
            id="hero-video"
            ref={videoRef}
            className="absolute z-0 w-full h-full object-cover brightness-[0.6]"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={HERO_POSTER_DATA_URL}
            onError={() => setVideoFailed(true)}
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/party_video.mp4" type="video/mp4" />
            <source src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/party_video.webm" type="video/webm" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep via-transparent to-jungle-deep/50"></div>
        <div className="relative z-10 p-4">
            <h1 
                className="font-display text-5xl sm:text-6xl md:text-8xl mb-4 text-white"
                style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.7)' }}
            >
                איפה תהיה המסיבה הבאה שלך?
            </h1>
            <p className="text-lg sm:text-xl text-jungle-text">אתר המסיבות של ישראל</p>
        </div>
      </div>
      
      <div className="space-y-16">
        {carouselsWithParties.map((carousel, index) => (
            <PartyCarousel
                key={carousel.id}
                title={carousel.title}
                parties={carousel.parties}
                viewAllLink={carousel.viewAllLink}
                variant={index === 0 ? 'coverflow' : 'standard'}
            />
        ))}
      </div>

      <div className="container mx-auto px-4 mt-16">
        <section className="max-w-5xl mx-auto bg-jungle-surface/80 border border-wood-brown/50 rounded-2xl p-8 shadow-xl space-y-4">
          <h2 className="text-3xl font-display text-white">למה לבחור ב- Parties 24/7?</h2>
          <p className="text-jungle-text/85 leading-relaxed">
            אנחנו בונים את חוויית חיפוש המסיבות כך שתהיה מהירה ואמינה: כל דף קטגוריה מקבל כותרת H1 ברורה, 300–500 מילים של הסבר על הוייב, וקישורים פנימיים שמחברים בין ערים, ז׳אנרים וקהלים. הדפים מתעדכנים אוטומטית כך שתמיד תראו את האירועים הבאים – מטכנו בדרום תל אביב דרך האוס רגוע בחיפה ועד מסיבות סטודנטים או 25 פלוס. בדקו את <Link to="/techno-parties" className="text-jungle-accent hover:text-white">דף הטכנו</Link>, את <Link to="/tel-aviv-parties" className="text-jungle-accent hover:text-white">מדריך תל אביב</Link> או את <Link to="/student-parties" className="text-jungle-accent hover:text-white">מסיבות הסטודנטים</Link> כדי לתכנן את הלילה הבא שלכם.
          </p>
          <p className="text-jungle-text/80 leading-relaxed">
            כדי שהאתר ייטען מהר, אנחנו משתמשים בטעינת Lazy לכל התמונות, קבצי WebP קלים ו-prefetch למסלולים הפופולריים. קיצורי הדרך בראש העמוד מחברים אתכם למסיבות היום, חמישי ושישי, בעוד עמוד החיפוש המצומצם מציג את כל הקטגוריות החדשות – כולל דפי מועדון ל-<Link to="/echo-club" className="text-jungle-accent hover:text-white">ECHO</Link> ול-<Link to="/jimmy-who-club" className="text-jungle-accent hover:text-white">Jimmy Who</Link>. שמרו את העמוד במועדפים וחזרו מדי שבוע כדי לא לפספס שום רייב.
          </p>
        </section>
      </div>
      <SocialsCta />
    </>
  );
};

export default HomePage;