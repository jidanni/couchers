"use client";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EnvironmentBanner } from "components/EnvironmentBanner";
import ErrorBoundary from "components/ErrorBoundary";
import AuthProvider from "features/auth/AuthProvider";
import { ReactQueryClientProvider } from "features/reactQueryClient";
import i18n from "i18n";
import React, { ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { theme } from "theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { GLOBAL } from "i18n/namespaces";

const HTML_META_DEFAULT_SHARE_IMAGE = "https://couchers.org/img/share.jpg";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
};

export async function generateMetadata() {
  const { t } = useTranslation(GLOBAL);

  const defaultTitle = t("html_meta.default_title");
  const metaDescription = t("html_meta.default_description");
  const metaImage = HTML_META_DEFAULT_SHARE_IMAGE;

  return {
    title: defaultTitle,
    description: metaDescription,
    openGraph: {
      title: defaultTitle,
      description: metaDescription,
      images: [metaImage],
    },
    twitter: {
      title: defaultTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <ErrorBoundary isFatal>
                <ReactQueryClientProvider>
                  <AuthProvider>
                    <CssBaseline />
                    <EnvironmentBanner />
                    {children}
                  </AuthProvider>
                </ReactQueryClientProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </I18nextProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </AppRouterCacheProvider>
  );
}
