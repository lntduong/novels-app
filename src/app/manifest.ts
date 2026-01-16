import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'vnnovely',
        short_name: 'vnnovely',
        description: 'Read your favorite novels for free',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#f97316',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
