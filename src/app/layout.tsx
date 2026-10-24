import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PMB Kampus - Penerimaan Mahasiswa Baru Terintegrasi Midtrans',
  description: 'Portal Resmi Pendaftaran Mahasiswa Baru Universitas Nusantara Teknologi Terintegrasi Pembayaran Otomatis Midtrans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
