"use client";

import { useEffect, useRef } from 'react';
import { trackPartyView } from '@/lib/analytics';

interface PartyViewTrackerProps {
    partyId: string;
    slug: string;
}

const PartyViewTracker: React.FC<PartyViewTrackerProps> = ({ partyId, slug }) => {
    const isRecorded = useRef(false);

    useEffect(() => {
        if (!isRecorded.current && partyId && slug) {
            trackPartyView(partyId, slug);
            isRecorded.current = true;
        }
    }, [partyId, slug]);

    return null;
};

export default PartyViewTracker;
