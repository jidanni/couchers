import { ReactNode } from "react";

import { Providers } from "./providers";
import Metadata from "next";
import Viewport from "next";
import AppRoute from "components/AppRoute";

export const viewport: Viewport = {
  themeColor: "#00a398",
};

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
export const metadata: Metadata = {
  icons: {
    apple: "/logo512.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  return (
    <html lang={params.locale ?? "en"}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <Providers>
          <AppRoute isPrivate={false} variant="full-screen">
            {children}
          </AppRoute>
        </Providers>
      </body>
    </html>
  );
}
