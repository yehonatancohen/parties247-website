import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const { slug, secret } = await request.json();

        // Optional: Add a secret token check for security
        // if (secret !== process.env.REVALIDATION_SECRET) {
        //   return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
        // }

        if (!slug) {
            return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
        }

        // Revalidate the specific event page
        revalidatePath(`/event/${slug}`);

        // Also revalidate the all-parties page since party data changed
        revalidatePath('/all-parties');

        // Revalidate the home page as well (in case carousels show this party)
        revalidatePath('/');

        return NextResponse.json({
            revalidated: true,
            message: `Successfully revalidated /event/${slug}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json({
            revalidated: false,
            message: 'Error revalidating'
        }, { status: 500 });
    }
}
