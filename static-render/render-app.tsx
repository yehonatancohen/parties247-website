import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { HelmetProvider, HelmetServerContext } from '../parties247-next/lib/react-helmet-async';
import { PartyProviderInitialState, Party } from '../types';
import { taxonomyConfigs } from '../data/taxonomy';
import { articles } from '../data/articles';
import { getParties, getCarousels, getDefaultReferral } from '../services/api';

const escapeState = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
    .replace(/\\u2028/g, '\\u2028')
    .replace(/\\u2029/g, '\\u2029');

const injectHelmet = (template: string, helmet: HelmetServerContext['helmet']) => {
  if (!helmet) {
    return template;
  }

  let html = template.replace(/<title>[\s\S]*?<\/title>/, '');

  const headTags = [
    helmet.title ? `<title>${helmet.title}</title>` : '',
    ...helmet.metas,
    ...helmet.links,
    ...helmet.scripts,
  ]
    .filter(Boolean)
    .join('\n    ');

  if (headTags) {
    html = html.replace('</head>', `    ${headTags}\n  </head>`);
  }

  if (helmet.htmlAttributes && Object.keys(helmet.htmlAttributes).length > 0) {
    const attributeString = Object.entries(helmet.htmlAttributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    html = html.replace(/<html[^>]*>/, `<html ${attributeString}>`);
  }

  return html;
};

export const fetchInitialState = async (): Promise<PartyProviderInitialState> => {
  try {
    const [parties, carousels, defaultReferral] = await Promise.all([
      getParties(),
      getCarousels(),
      getDefaultReferral(),
    ]);

    return {
      parties,
      carousels,
      defaultReferral,
    };
  } catch (error) {
    console.warn('Failed to fetch live party data for prerendering; falling back to empty dataset.', error);
    return {
      parties: [],
      carousels: [],
      defaultReferral: '',
    };
  }
};

export const buildRouteList = (parties: Party[]): string[] => {
  const baseRoutes = new Set<string>([
    '/',
    '/all-parties',
    '/כתבות',
    '/about',
    '/terms',
    '/privacy',
    '/accessibility',
  ]);

  taxonomyConfigs.forEach((config) => baseRoutes.add(config.path));
  articles.forEach((article) => baseRoutes.add(`/כתבות/${article.slug}`));

  const now = new Date();
  const upcomingParties = parties
    .filter((party) => new Date(party.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const eventsToRender = upcomingParties.slice(0, 24);
  eventsToRender.forEach((party) => baseRoutes.add(`/event/${party.slug}`));

  const perPage = 20;
  const totalPages = Math.min(Math.ceil(upcomingParties.length / perPage), 3);
  for (let page = 2; page <= totalPages; page += 1) {
    baseRoutes.add(`/all-parties/עמוד/${page}`);
  }

  return Array.from(baseRoutes).sort((a, b) => a.localeCompare(b, 'he'));
};

export const renderAppToHtml = (
  route: string,
  template: string,
  initialState: PartyProviderInitialState,
): string => {
  const helmetContext: HelmetServerContext = {};
  const markup = renderToString(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[route]}>
        <App initialState={initialState} />
      </MemoryRouter>
    </HelmetProvider>,
  );

  let html = injectHelmet(template, helmetContext.helmet);
  html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  const stateScript = `<script>window.__PARTIES247_BOOTSTRAP__=${escapeState(initialState)};</script>`;
  html = html.replace('</body>', `  ${stateScript}\n</body>`);

  return html;
};
