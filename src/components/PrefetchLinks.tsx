import React from 'react';
import { Helmet } from '../lib/react-helmet-async';

const PrefetchLinks: React.FC = () => (
  <Helmet>
    <link rel="preconnect" href="https://d15q6k8l9pfut7.cloudfront.net" crossOrigin="anonymous" />
    {/* Warms up DNS/TLS to go-out.co ahead of the purchase-button click, so the
        eventual redirect resolves faster once the user actually buys. */}
    <link rel="preconnect" href="https://www.go-out.co" />
    <link rel="preconnect" href="https://go-out.co" />
    <link rel="dns-prefetch" href="https://www.go-out.co" />
    <link rel="dns-prefetch" href="https://go-out.co" />
  </Helmet>
);

export default PrefetchLinks;
