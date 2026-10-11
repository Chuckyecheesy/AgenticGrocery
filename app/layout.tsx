import type { ReactNode } from "react";

export const metadata = {
  title: "Agentic Grocery",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  );
}
