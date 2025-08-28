import './globals.css';

export const metadata = {
  title: 'Invoice Generator',
  description: 'Professional invoice generation with MyFatoorah integration'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
