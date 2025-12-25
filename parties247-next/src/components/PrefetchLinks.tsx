import React from "react";

const PrefetchLinks: React.FC = () => (
  <>
    <link rel="preconnect" href="https://d15q6k8l9pfut7.cloudfront.net" crossOrigin="anonymous" />
    <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
    <link rel="prefetch" href="/all-parties" as="document" />
    <link rel="prefetch" href="/thursday-parties" as="document" />
    <link rel="prefetch" href="/friday-parties" as="document" />
    <link rel="prefetch" href="/techno-parties" as="document" />
    <link rel="prefetch" href="/tel-aviv-parties" as="document" />
  </>
);

export default PrefetchLinks;
