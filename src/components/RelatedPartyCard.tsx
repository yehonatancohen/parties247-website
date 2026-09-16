import React from 'react';
import { Party } from '../data/types';
import LaunchPartyCard from './home/LaunchPartyCard';

interface RelatedPartyCardProps {
  party: Party;
}

const RelatedPartyCard: React.FC<RelatedPartyCardProps> = ({ party }) => (
  <LaunchPartyCard party={party} sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw" />
);

export default RelatedPartyCard;
