import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        // Get IP from headers (works with proxies/Vercel/Cloudflare)
        const forwardedFor = req.headers.get('x-forwarded-for');
        let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

        // MOCK IP for Local Development to verify GeoIP
        if (process.env.NODE_ENV === 'development' && (ip === '127.0.0.1' || ip === '::1')) {
            ip = '113.161.73.18'; // VNPT IP (Hanoi, Vietnam)
        }

        // Parse User Agent
        const userAgent = req.headers.get('user-agent') || '';
        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser().name || 'Unknown';
        const device = parser.getDevice().type || 'Desktop'; // Default to Desktop if undefined
        const os = parser.getOS().name || 'Unknown';

        // Get Geo Location
        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : null;
        const city = geo ? geo.city : null;

        await prisma.pageView.create({
            data: {
                path,
                ip,
                country,
                city,
                browser,
                device,
                os,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
