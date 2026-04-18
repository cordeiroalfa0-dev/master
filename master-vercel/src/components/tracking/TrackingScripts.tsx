import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Settings = Record<string, string>;

/**
 * Carrega IDs de tracking do banco e injeta GTM, GA4, Meta Pixel, TikTok, Clarity.
 * Tudo client-side; respeita "consent" do banner de cookies (sessionStorage).
 */
export function TrackingScripts() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [consent, setConsent] = useState<boolean>(false);

  useEffect(() => {
    setConsent(localStorage.getItem("me_cookie_consent") === "accepted");
    const handler = () =>
      setConsent(localStorage.getItem("me_cookie_consent") === "accepted");
    window.addEventListener("me:consent-changed", handler);
    return () => window.removeEventListener("me:consent-changed", handler);
  }, []);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        if (!active || !data) return;
        const map: Settings = {};
        for (const r of data) if (r.value) map[r.key] = r.value;
        setSettings(map);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!consent || !settings) return;

    // GTM
    if (settings.gtm_id && !document.getElementById("gtm-script")) {
      const s = document.createElement("script");
      s.id = "gtm-script";
      s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtm_id}');`;
      document.head.appendChild(s);
    }

    // GA4 direto
    if (settings.ga4_id && !document.getElementById("ga4-script")) {
      const s1 = document.createElement("script");
      s1.id = "ga4-script";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${settings.ga4_id}');`;
      document.head.appendChild(s2);
    }

    // Google Ads
    if (settings.google_ads_id && !document.getElementById("gads-script")) {
      const s = document.createElement("script");
      s.id = "gads-script";
      s.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('config','${settings.google_ads_id}');`;
      document.head.appendChild(s);
      // Expõe IDs para a página /obrigado disparar evento de conversão
      (window as any).__GADS_ID__ = settings.google_ads_id;
      if (settings.google_ads_conversion_label) {
        (window as any).__GADS_LABEL__ = settings.google_ads_conversion_label;
      }
    }

    // Meta Pixel
    if (settings.meta_pixel_id && !document.getElementById("meta-pixel")) {
      const s = document.createElement("script");
      s.id = "meta-pixel";
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.meta_pixel_id}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }

    // TikTok Pixel
    if (settings.tiktok_pixel_id && !document.getElementById("tt-pixel")) {
      const s = document.createElement("script");
      s.id = "tt-pixel";
      s.innerHTML = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${settings.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');`;
      document.head.appendChild(s);
    }

    // Microsoft Clarity
    if (settings.clarity_id && !document.getElementById("clarity-script")) {
      const s = document.createElement("script");
      s.id = "clarity-script";
      s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${settings.clarity_id}");`;
      document.head.appendChild(s);
    }
  }, [consent, settings]);

  // Render noscript pixels in body for GTM and Meta fallback
  if (!consent || !settings) return null;
  return (
    <>
      {settings.gtm_id && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
      )}
      {settings.meta_pixel_id && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${settings.meta_pixel_id}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
