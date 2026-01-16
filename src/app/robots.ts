import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/private/'],
        },
        sitemap: 'https://novels.yangyu.win/sitemap.xml',
    }
}
