import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import { FileWarning } from "lucide-react";
import { type ReactNode } from "react";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/lib/auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "Private Office — High-stakes correspondence, professionally prepared, provably delivered",
      },
      {
        name: "description",
        content:
          "Private Office provides professional correspondence preparation, evidence organization, certified mailing, and proof of delivery for high-stakes matters. Part of the MailMyPDF ecosystem.",
      },
      { name: "robots", content: "index,follow" },
      { name: "theme-color", content: "#4338ca" },
      {
        property: "og:title",
        content: "Private Office — High-stakes correspondence, professionally prepared",
      },
      {
        property: "og:description",
        content:
          "Prepare, review, send, track, and document your most important correspondence.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Private Office" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Private Office — High-stakes correspondence",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="py-20 md:py-32">
        <div className="container max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
            <FileWarning size={36} className="text-indigo-400" />
          </div>
          <h1
            className="mt-8 text-6xl font-bold text-indigo-700"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            404
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-indigo-600">
            This page is not available
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            The page you're looking for doesn't exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              Back to home
            </Link>
            <Link to="/workflows/contractor-dispute" className="btn-gold">
              Start a Matter
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
