declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

export function pushToDataLayer(event: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
}

export function trackPurchaseButtonClick(partyName?: string, partyId?: string, price?: number): void {
    pushToDataLayer({
        event: 'purchase_button_click',
        party_name: partyName,
        party_id: partyId,
        price: price,
    });
}
