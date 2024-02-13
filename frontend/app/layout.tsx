'use client';

import './globals.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { Inter } from 'next/font/google';

import Footer from './_components/common/footer';
import Header from './_components/common/header';

const inter = Inter({ subsets: ['latin'] });

// 環境変数から実行環境を取得
const env = process.env.NODE_ENV;
const redirect_uri = env === 'development' ? 'http://localhost:3000' : 'https://d3mwjf00vjzws7.cloudfront.net';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/icon.webp" />
        <meta name="description" content="資格の種は、資格取得のための学習をサポートするサービスです。" />
      </head>
      <body className={inter.className}>
        <Auth0Provider
          domain="dev-lubuvw0qul5rra7p.us.auth0.com"
          clientId="5D1s5pRVEVwG6xP2GWfA5wrW3x6HAj6M"
          authorizationParams={{
            redirect_uri: redirect_uri,
          }}
        >
          <Header />
          <main className="flex items-center justify-center p-4">{children}</main>
          <Footer />
        </Auth0Provider>
      </body>
    </html>
  );
}
