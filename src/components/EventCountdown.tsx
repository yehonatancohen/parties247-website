'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) return null;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}

export default function EventCountdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTimeLeft(calculateTimeLeft(targetDate));

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!mounted || !timeLeft) return null;

    const units = [
        { label: 'ימים', value: timeLeft.days },
        { label: 'שעות', value: timeLeft.hours },
        { label: 'דקות', value: timeLeft.minutes },
        { label: 'שניות', value: timeLeft.seconds },
    ];

    return (
        <div className="rounded-2xl border border-jungle-accent/20 bg-gradient-to-r from-jungle-surface/80 via-jungle-deep/60 to-jungle-surface/80 backdrop-blur-sm p-5 md:p-6">
            <p className="text-center text-sm text-jungle-text/70 mb-3 font-semibold uppercase tracking-wider">
                ⏳ האירוע מתחיל בעוד
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-5" dir="ltr">
                {units.map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-3 md:gap-5">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl bg-jungle-deep/80 border border-jungle-accent/30 flex items-center justify-center shadow-lg shadow-jungle-accent/5">
                                    <span className="font-display text-2xl md:text-4xl text-jungle-lime tabular-nums">
                                        {String(unit.value).padStart(2, '0')}
                                    </span>
                                </div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-xl bg-jungle-lime/5 blur-md -z-10" />
                            </div>
                            <span className="text-[10px] md:text-xs text-jungle-text/50 mt-1.5 uppercase tracking-wider">
                                {unit.label}
                            </span>
                        </div>
                        {i < units.length - 1 && (
                            <span className="text-jungle-accent/50 font-display text-xl md:text-2xl mb-4 animate-pulse">:</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
