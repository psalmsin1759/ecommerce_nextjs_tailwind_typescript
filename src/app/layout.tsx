import type { Metadata } from 'next';
import { Inter, Jost } from 'next/font/google';
import '@/styles/globals.css';
import DefaultLayout from './default_layout';

const inter = Inter({ subsets: ['latin'] });
const jost = Jost({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HOUSE OF EPPAGELIA',
  description: 'HOUSE OF EPPAGELIA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
