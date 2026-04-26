export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/images/:path*',
    '/videos/:path*',
    '/gallery/:path*',
    '/api/images/:path*',
    '/api/videos/:path*',
    '/api/gallery/:path*',
  ],
}
