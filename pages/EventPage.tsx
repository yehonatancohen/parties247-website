// FIX: Corrected a typo in the React import statement (removed an extra 'a,') which was causing compilation errors.
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Party } from '../types';
import { getPartyBySlug } from '../services/api';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParties } from '../hooks/useParties';
import { CalendarIcon, LocationIcon, LeafIcon, PartyPopperIcon, FireIcon } from '../components/Icons';
import { BASE_URL } from '../constants';
import ShareButtons from '../components/ShareButtons';
import RelatedPartyCard from '../components/RelatedPartyCard';
import { trackPartyRedirect } from '../lib/analytics';

const EventPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const { parties: allParties, defaultReferral, isLoading: partiesLoading, carousels } = useParties();
  const initialParty = useMemo(
    () => (slug ? allParties.find((p) => p.slug === slug) ?? null : null),
    [allParties, slug],
  );
  const [party, setParty] = useState<Party | null>(initialParty);
  const [isLoading, setIsLoading] = useState(!initialParty);
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  useEffect(() => {
    if (initialParty && (!party || party.id !== initialParty.id)) {
      setParty(initialParty);
      setIsLoading(false);
    }
  }, [initialParty, party]);

  useEffect(() => {
    setCouponRevealed(false);
    setCouponCopied(false);
  }, [party?.id]);

  useEffect(() => {
    const fetchAndMergeParty = async () => {
      if (!slug) {
        setError("No party slug provided.");
        setIsLoading(false);
        return;
      }

      // We wait for the main party list to load, as it contains the correct image URLs.
      if (partiesLoading) {
        // The main spinner is active, so we just wait for the next render cycle.
        return;
      }
      
      if (!initialParty) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Fetch the detailed, potentially more up-to-date, info from the specific event endpoint.
        const partyFromApi = await getPartyBySlug(slug);

        // Find the same party in the main list, which we know has a valid image URL.
        const partyFromList = allParties.find(p => p.slug === slug);
        
        // Combine the data: use the detailed info from the API, but fall back to the
        // list's image URL if the API response is missing one.
        const finalParty: Party = {
          ...partyFromApi,
          imageUrl: partyFromApi.imageUrl || partyFromList?.imageUrl || '',
          // Preserve identifiers from the list because the detailed event
          // endpoint currently omits the party id.
          id: partyFromApi.id || partyFromList?.id || initialParty?.id || '',
        };

        if (!finalParty.id) {
          console.warn(`Could not determine a party id for slug: ${slug}`);
        }

        if (!finalParty.imageUrl) {
            console.warn(`Could not find an image URL for party slug: ${slug}`);
        }

        setParty(finalParty);
      } catch (err) {
        setError('Failed to load party details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMergeParty();
  }, [slug, allParties, partiesLoading, initialParty]);

  const getReferralUrl = (originalUrl: string, partyReferral?: string): string => {
    try {
      const referralCode = partyReferral || defaultReferral;
      if (!referralCode || !originalUrl) return originalUrl;
      const url = new URL(originalUrl);
      url.searchParams.delete('aff');
      url.searchParams.delete('referrer');
      url.searchParams.set('ref', referralCode);
      return url.toString();
    } catch (e) {
      return originalUrl;
    }
  };
  
  const getTagColor = (tag: string) => {
    if (tag === 'לוהט') return 'bg-red-500/80 text-white';
    if (tag === 'ביקוש גבוה') return 'bg-yellow-500/80 text-jungle-deep';
    return 'bg-jungle-accent/80 text-jungle-deep';
  };

  const isHotParty = useMemo(() => {
    if (!party) {
      return false;
    }

    return carousels.some(carousel => {
      const normalizedTitle = carousel.title.toLowerCase();
      const isHotCarousel = normalizedTitle.includes('hot') || carousel.title.includes('לוהט');
      return isHotCarousel && carousel.partyIds.includes(party.id);
    });
  }, [carousels, party]);

  const couponCode = 'parties24.7';

  const handleRevealCoupon = () => {
    setCouponRevealed(true);
  };

  const handleCopyCoupon = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(couponCode);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = couponCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        throw new Error('Clipboard API not available');
      }
      setCouponCopied(true);
      setTimeout(() => setCouponCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code', error);
      setCouponCopied(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error || !party) {
    return <div className="text-center text-white text-2xl py-16">{error || 'Party could not be loaded.'}</div>;
  }
  
  const relatedParties = allParties.filter(p => {
      if (p.id === party.id) return false;
      if (new Date(p.date) < new Date()) return false;
      const inSameCity = p.location.name === party.location.name;
      const hasSharedTag = p.tags.some(tag => party.tags.includes(tag));
      return inSameCity || hasSharedTag;
  }).slice(0, 4);

  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', { dateStyle: 'full', timeZone: 'Asia/Jerusalem' }).format(partyDate);
  const formattedTime = new Intl.DateTimeFormat('he-IL', { timeStyle: 'short', timeZone: 'Asia/Jerusalem' }).format(partyDate);
  
  const referralUrl = getReferralUrl(party.originalUrl, party.referralCode);

  const handlePurchaseClick = () => {
    trackPartyRedirect(party.id, party.slug);
  };

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': party.name,
    'startDate': party.date,
    'eventStatus': party.eventStatus || 'https://schema.org/EventScheduled',
    'eventAttendanceMode': party.eventAttendanceMode || 'https://schema.org/OfflineEventAttendanceMode',
    'location': {
      '@type': 'Place',
      'name': party.location.name,
      'address': party.location.address || party.location.name,
      ...(party.location.geo && {
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': party.location.geo.latitude,
          'longitude': party.location.geo.longitude,
        },
      }),
    },
    'image': [party.imageUrl],
    'description': party.description,
    'offers': {
      '@type': 'Offer',
      'url': referralUrl,
      'price': '0',
      'priceCurrency': 'ILS',
      'availability': 'https://schema.org/InStock',
      'validFrom': new Date().toISOString(),
    },
    ...(party.performer && {
      'performer': {
        '@type': 'PerformingGroup',
        'name': party.performer.name,
      },
    }),
    ...(party.organizer && {
      'organizer': {
        '@type': 'Organization',
        'name': party.organizer.name,
        'url': party.organizer.url,
      },
    }),
  };

  const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'בית',
        'item': `${BASE_URL}/`
      },{
        '@type': 'ListItem',
        'position': 2,
        'name': 'כל המסיבות',
        'item': `${BASE_URL}/all-parties`
      },{
        '@type': 'ListItem',
        'position': 3,
        'name': party.name,
      }]
  };


  return (
    <>
      <SeoManager
        title={`${party.name} | Parties 24/7`}
        description={party.description.substring(0, 160)}
        canonicalPath={`/event/${party.slug}`}
        ogImage={party.imageUrl}
        ogType="article"
        jsonLd={[eventJsonLd, breadcrumbJsonLd]}
      />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-jungle-surface rounded-xl overflow-hidden shadow-lg border border-wood-brown/50">
            <div className="md:grid md:grid-cols-5 md:gap-8">
                <div className="md:col-span-2">
                    <img src={party.imageUrl} alt={party.name} className="w-full h-64 md:h-full object-cover" />
                </div>
                <div className="md:col-span-3 p-6 md:p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {party.tags.map(tag => (
                            <span key={tag} className={`${getTagColor(tag)} text-xs font-bold px-3 py-1 rounded-full flex items-center`}>
                               {tag === 'לוהט' && <FireIcon className="w-4 h-4 ml-1" />}
                               {tag === 'ביקוש גבוה' && <PartyPopperIcon className="w-4 h-4 ml-1" />}
                               {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-white mb-4">{party.name}</h1>
                    <div className="space-y-4 text-jungle-text mb-6">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="h-6 w-6 text-jungle-accent mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-bold">{formattedDate}</p>
                                <p className="text-sm">{formattedTime}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <LocationIcon className="h-6 w-6 text-jungle-accent mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-bold">{party.location.name}</p>
                                {party.location.address && <p className="text-sm">{party.location.address}</p>}
                            </div>
                        </div>
                    </div>

                    <p className="text-jungle-text/90 whitespace-pre-line mb-6">{party.description}</p>
                    
                    {isHotParty && (
                      <div className="mb-6">
                        {!couponRevealed ? (
                          <button
                            type="button"
                            onClick={handleRevealCoupon}
                            className="w-full rounded-xl border border-jungle-accent/60 bg-gradient-to-r from-jungle-lime/80 to-jungle-accent/80 py-4 px-6 text-2xl font-display text-jungle-deep shadow-lg transition-transform hover:-translate-y-1"
                          >
                            🔥 חשפו קופון למסיבה
                          </button>
                        ) : (
                          <div className="rounded-2xl border border-jungle-accent/60 bg-jungle-surface/80 p-5 text-center shadow-lg">
                            <p className="mb-3 text-sm text-jungle-text/80">לחצו על הקופון כדי להעתיק ולהשתמש ברכישת הכרטיסים</p>
                            <button
                              type="button"
                              onClick={handleCopyCoupon}
                              className="w-full rounded-xl bg-gradient-to-r from-jungle-accent to-jungle-lime py-3 px-4 text-jungle-deep transition-transform hover:scale-[1.02]"
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-mono text-2xl tracking-[0.3em]">{couponCode}</span>
                                <span className="text-sm font-semibold">{couponCopied ? 'הקופון הועתק!' : 'העתיקו בלחיצה'}</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <ShareButtons partyName={party.name} shareUrl={referralUrl} />
                    </div>
                    
                    <a
                      href={referralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handlePurchaseClick}
                      className="w-full flex items-center justify-center gap-3 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-display text-3xl py-4 px-6 rounded-lg transition-transform hover:scale-105 tracking-wider"
                    >
                      <span>לרכישת כרטיסים</span>
                      <LeafIcon className="w-6 h-6" />
                    </a>
                </div>
            </div>
            <div className="p-6 md:p-8 border-t border-wood-brown/50">
              <h3 className="text-xl font-display text-white mb-4">מיקום על המפה</h3>
              <div className="aspect-[16/9] rounded-lg overflow-hidden border-2 border-wood-brown/50">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(party.location.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${party.location.name}`}
                ></iframe>
              </div>
            </div>
        </div>

        {relatedParties.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-3xl font-display text-center mb-6 text-white">מסיבות דומות שאולי תאהבו</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedParties.map(relatedParty => (
                <RelatedPartyCard key={relatedParty.id} party={relatedParty} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventPage;