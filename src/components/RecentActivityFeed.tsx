"use client";

import React, { useEffect, useState } from 'react';
import { getRecentActivity } from '../services/api';
import { RecentActivityEvent } from '../data/types';
import LoadingSpinner from './LoadingSpinner';
import { TicketIcon } from './Icons';

// Use a simple icon for generic visits if not available in Icons
const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.959 11.959 0 013 12a11.959 11.959 0 01-2.917-8.192" />
    </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const RecentActivityFeed: React.FC = () => {
    const [events, setEvents] = useState<RecentActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getRecentActivity();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();

        // Poll every 30 seconds
        const interval = setInterval(fetchEvents, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return <div className="p-6 flex justify-center"><LoadingSpinner /></div>;
    }

    if (events.length === 0) {
        return <div className="p-6 text-center text-gray-500">אין פעילות נרשמה לאחרונה</div>;
    }

    return (
        <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-6 h-full">
            <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
                📡 פעילות אחרונה
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div className={`mt-1 p-2 rounded-full ${event.type === 'purchase' ? 'bg-jungle-lime/20 text-jungle-lime' :
                            event.type === 'view' ? 'bg-blue-500/20 text-blue-500' :
                                'bg-purple-500/20 text-purple-500'
                            }`}>
                            {event.type === 'purchase' && <TicketIcon className="w-4 h-4" />}
                            {event.type === 'view' && <EyeIcon className="w-4 h-4" />}
                            {event.type === 'visit' && <GlobeIcon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-200 truncate">
                                    {event.type === 'purchase' ? 'רכישת כרטיס' :
                                        event.type === 'view' ? 'צפייה במסיבה' : 'ביקור באתר'}
                                </p>
                                <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                                    {new Date(event.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {event.partyName && (
                                <p className="text-xs text-blue-300 mt-0.5 truncate">{event.partyName}</p>
                            )}
                            {event.details && (
                                <p className="text-xs text-gray-500 mt-1">{event.details}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivityFeed;
