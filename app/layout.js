import './globals.css';
import './print.css';

export const metadata = {
  title: 'Pilot Logbook',
  description: 'Pilot logbook',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
