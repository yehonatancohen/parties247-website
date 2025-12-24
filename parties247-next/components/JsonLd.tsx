import React from 'react';
import { Helmet } from '@/parties247-next/lib/react-helmet-async';

interface JsonLdProps {
  data: object | object[];
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const items = Array.isArray(data) ? data : [data];
  if (!items.length) {
    return null;
  }

  return (
    <Helmet>
      {items.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default JsonLd;
