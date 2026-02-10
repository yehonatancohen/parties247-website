"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GLOBAL_PIXEL_ID } from "../data/constants";

export default function GlobalPixelTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!GLOBAL_PIXEL_ID) return;

        if (isFirstRun.current) {
            isFirstRun.current = false;
            // Assume initialized by Script tag below, but we could manually verify or just rely on react-hydration.
            // However, the Script tag below runs immediately.
            return;
        }

        if (window.fbq) {
            window.fbq("track", "PageView");
        }
    }, [pathname, searchParams]);

    if (!GLOBAL_PIXEL_ID) return null;

    return (
        <>
            <Script
                id="fb-pixel-global"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${GLOBAL_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${GLOBAL_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt="Meta Pixel"
                />
            </noscript>
        </>
    );
}
