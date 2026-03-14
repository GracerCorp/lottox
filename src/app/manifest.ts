import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LOTTOX - Worldwide Lottery Results',
    short_name: 'LOTTOX',
    description: 'Fast, accurate, and reliable worldwide lottery results platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192 512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  }
}
