
import React, { useEffect } from 'react';
import { Party } from '../types';

interface SeoManagerProps {
  title: string;
  description: string;
  parties?: Party[];
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, parties = [] }) => {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }

    // Remove existing structured data script
    const existingScript = document.getElementById('json-ld-events');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script if there are parties
    if (parties.length > 0) {
      const script = document.createElement('script');
      script.id = 'json-ld-events';
      script.type = 'application/ld+json';

      const eventsData = parties.map(party => ({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: party.name,
        startDate: party.date,
        description: party.description,
        location: {
          '@type': 'Place',
          name: party.location,
          address: party.location,
        },
        image: [party.imageUrl],
        offers: {
          '@type': 'Offer',
          url: party.originalUrl,
          availability: 'https://schema.org/InStock',
        },
      }));
      
      script.textContent = JSON.stringify(eventsData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const script = document.getElementById('json-ld-events');
      if (script) {
        script.remove();
      }
    };

  }, [title, description, parties]);

  return null; // This component does not render anything
};

export default SeoManager;
