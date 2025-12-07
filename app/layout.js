import "./globals.css";

export const metadata = {
  title: "X1 Space - Blockchain Explorer",
  description: "X1 Blockchain Explorer and Analytics Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
