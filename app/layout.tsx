import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPAPP – Kids Visual Calendar',
  description: 'Agenda & Emotions for 3 kids',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1>PPAPP – Kids Visual Calendar</h1>
          <p style={{opacity:0.7}}>Agenda & Emotions MVP</p>
          {children}
        </div>
      </body>
    </html>
  );
}
