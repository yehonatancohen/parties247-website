import React from 'react';
import { Party } from '../data/types';
import { isCouponEligible } from '../data/constants';
import LaunchPartyCard from './home/LaunchPartyCard';
import DiscountCodeReveal from './DiscountCodeReveal';

interface PartyCardProps {
  party: Party;
  /** `sizes` for the flyer image; defaults to the listing grid (2–5 columns). */
  sizes?: string;
}

/** Listing-grid card: the shared launch card plus the account1 coupon reveal. */
const PartyCard: React.FC<PartyCardProps> = ({
  party,
  sizes = '(min-width: 1280px) 230px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
}) => {
  const showDiscountCode = !party.soldOut && isCouponEligible(party.referralCode);

  return (
    <div className="flex h-full flex-col">
      <LaunchPartyCard party={party} sizes={sizes} />
      {showDiscountCode && <DiscountCodeReveal className="mt-1 text-right" partyId={party.id} />}
    </div>
  );
};

export default PartyCard;
