// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { decrypt } from './lib/session';

// const protectedRoutes = ['/'];
// const publicRoutes = ['/login'];

// export default async function middleware(req) {
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   const cookie = await cookies().get('session')?.value;
//   const session = await decrypt(cookie);

//   if (isProtectedRoute && !session?.email) {
//     return NextResponse.redirect(new URL('/login', req.nextUrl));
//   }

//   if (isPublicRoute && session?.email) {
//     return NextResponse.redirect(new URL('/', req.nextUrl));
//   }

//   return NextResponse.next();
// }

// THIS NEEDS TO BE IN ROOT FOLDER!!!! BUT IT DOES NOT WORK ON VERCEL!!!!!!!!!
