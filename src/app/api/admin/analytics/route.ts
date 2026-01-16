import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();
        const sevenDaysAgo = subDays(now, 7);
        const thirtyDaysAgo = subDays(now, 30);

        // 1. Daily Views (Last 7 Days)
        // Grouping by date in Prisma can be tricky with raw SQL or post-processing.
        // For simplicity and DB agnostic behavior, we'll fetch entries and aggregate in JS for now.
        // Optimization: Use raw SQL for large datasets.
        const recentViews = await prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                createdAt: true,
            },
        });

        const dailyMap = new Map<string, number>();
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const dateStr = format(subDays(now, i), 'yyyy-MM-dd');
            dailyMap.set(dateStr, 0);
        }

        recentViews.forEach(view => {
            const dateStr = format(view.createdAt, 'yyyy-MM-dd');
            if (dailyMap.has(dateStr)) {
                dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
            }
        });

        const chartData = Array.from(dailyMap.entries()).map(([date, count]) => ({
            date,
            views: count,
        }));

        // 2. Visitors by Country (All time or last 30 days - let's do last 30 days for relevance)
        const countryViews = await prisma.pageView.findMany({
            where: {
                country: { not: null },
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { country: true }
        });

        const countryMap = new Map<string, number>();
        countryViews.forEach(v => {
            if (v.country) {
                countryMap.set(v.country, (countryMap.get(v.country) || 0) + 1);
            }
        });

        const visitorMap = Array.from(countryMap.entries())
            .map(([code, count]) => ({ code, count }))
            .sort((a, b) => b.count - a.count);

        // 3. Recent Visitors
        const recentVisitors = await prisma.pageView.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                ip: true,
                path: true,
                country: true,
                browser: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            chartData,
            visitorMap,
            recentVisitors,
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
