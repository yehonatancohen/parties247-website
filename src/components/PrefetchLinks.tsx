import React from 'react';
import { Helmet } from '../lib/react-helmet-async';

const PrefetchLinks: React.FC = () => (
  <Helmet>
    <link rel="preconnect" href="https://d15q6k8l9pfut7.cloudfront.net" crossOrigin="anonymous" />
    <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
    {/* Warms up DNS/TLS to go-out.co ahead of the purchase-button click, so the
        eventual redirect resolves faster once the user actually buys. */}
    <link rel="preconnect" href="https://www.go-out.co" />
    <link rel="preconnect" href="https://go-out.co" />
    <link rel="dns-prefetch" href="https://www.go-out.co" />
    <link rel="dns-prefetch" href="https://go-out.co" />
    <link rel="prefetch" href="/all-parties" as="document" />
    <link rel="prefetch" href="/day/thursday" as="document" />
    <link rel="prefetch" href="/day/friday" as="document" />
    <link rel="prefetch" href="/genre/techno-music" as="document" />
    <link rel="prefetch" href="/cities/tel-aviv" as="document" />
  </Helmet>
);

export default PrefetchLinks;
