import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function getAnalyticsData() {
    try {
        const now = new Date();
        const sevenDaysAgo = subDays(now, 7);
        const thirtyDaysAgo = subDays(now, 30);

        // 1. Daily Views (Last 7 Days)
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
            const dateStr = format(subDays(now, i), 'dd/MM');
            dailyMap.set(dateStr, 0);
        }

        recentViews.forEach(view => {
            const dateStr = format(view.createdAt, 'dd/MM');
            if (dailyMap.has(dateStr)) {
                dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
            }
        });

        const chartData = Array.from(dailyMap.entries()).map(([date, views]) => ({
            date,
            views,
        }));

        // 2. Visitors by Country (Last 30 days)
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

        return {
            chartData,
            visitorMap,
            recentVisitors,
        };
    } catch (error) {
        console.error('Analytics Data Error:', error);
        return {
            chartData: [],
            visitorMap: [],
            recentVisitors: [],
        };
    }
}
