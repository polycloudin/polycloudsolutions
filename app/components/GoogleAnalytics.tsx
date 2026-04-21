import Script from "next/script";

/**
 * Load GA4 only in production when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Env var must be prefixed NEXT_PUBLIC_ to reach the client. Set in Vercel →
 * Settings → Environment Variables for the Production environment.
 *
 * Measurement ID looks like "G-XXXXXXXXXX".
 */
// Public Measurement ID is safe to commit — it's exposed to every visitor anyway
// via the gtag script tag. Env var takes precedence so we can rotate without a deploy.
const DEFAULT_GA_ID = "G-SJ69BM14MB";

export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
  if (!id || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
