import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { ReactQueryProvider } from "./providers/react-query-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { WorkspaceProvider } from "./providers/workspace-provider";
import { AuthProvider } from "./providers/auth-provider";
import { Toaster } from "sonner";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Prevent flash: apply dark class before paint */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;d.classList.remove('dark','light');if(t==='light'){d.classList.add('light')}else{d.classList.add('dark')}}catch(e){}})()`,
        }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <WorkspaceProvider>
          <AuthProvider>
            <Outlet />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  borderRadius: "8px",
                },
              }}
            />
          </AuthProvider>
        </WorkspaceProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    details = error.status === 404 ? "This page doesn't exist." : error.statusText;
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="text-center space-y-4">
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>{message}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{details}</p>
        <a href="/" style={{ color: "var(--brand)", fontSize: 13 }}>Return home</a>
      </div>
    </main>
  );
}
