import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  getCookieConsent,
  saveCookieConsent,
  clearCookieConsent,
  type CookieConsent,
} from "@/components/CookieBanner";

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return { setRef, inView };
}

const cookieTypes = [
  {
    type: "Essential",
    key: "essential" as const,
    emoji: "🔒",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    always: true,
    desc: "These cookies are strictly necessary for the website to function and cannot be switched off. They are set in response to actions you take such as logging in, filling out forms, or setting privacy preferences.",
    examples: [
      { name: "ejf_user", purpose: "Stores your login session and profile data", duration: "Until logout" },
      { name: "ejf_cookie_consent", purpose: "Remembers your cookie preferences", duration: "1 year" },
    ],
  },
  {
    type: "Functional",
    key: "functional" as const,
    emoji: "⚙️",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    always: false,
    desc: "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we have added to our pages.",
    examples: [
      { name: "ejf_theme", purpose: "Remembers your display and accessibility preferences", duration: "6 months" },
      { name: "ejf_lang", purpose: "Stores your preferred language setting", duration: "6 months" },
    ],
  },
  {
    type: "Analytics",
    key: "analytics" as const,
    emoji: "📊",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    always: false,
    desc: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and anonymous.",
    examples: [
      { name: "_ga", purpose: "Distinguishes unique users for Google Analytics", duration: "2 years" },
      { name: "_gid", purpose: "Distinguishes users session-by-session", duration: "24 hours" },
    ],
  },
  {
    type: "Marketing",
    key: "marketing" as const,
    emoji: "📢",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    always: false,
    desc: "These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites. EJF uses them only to promote our advocacy campaigns.",
    examples: [
      { name: "fbp", purpose: "Facebook Pixel — tracks campaign performance", duration: "3 months" },
      { name: "li_fat_id", purpose: "LinkedIn conversion tracking", duration: "30 days" },
    ],
  },
];

function ToggleSwitch({ checked, disabled = false, onChange }: { checked: boolean; disabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none ${
        checked ? "bg-[#d4a017]" : "bg-gray-300"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
      aria-label="Toggle cookie category"
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function CookiePolicy() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const c = getCookieConsent();
    setConsent(c);
    if (c) {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
      setFunctional(c.functional);
    }
  }, []);

  const handleSave = () => {
    const updated: CookieConsent = {
      decision: "custom",
      essential: true,
      analytics,
      marketing,
      functional,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(updated);
    setConsent(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    const updated: CookieConsent = {
      decision: "all",
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(updated);
    setConsent(updated);
    setAnalytics(true);
    setMarketing(true);
    setFunctional(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    clearCookieConsent();
    setConsent(null);
    setAnalytics(false);
    setMarketing(false);
    setFunctional(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isChecked = (key: keyof CookieConsent) => {
    if (key === "essential") return true;
    if (key === "analytics") return analytics;
    if (key === "marketing") return marketing;
    if (key === "functional") return functional;
    return false;
  };

  const handleToggle = (key: keyof CookieConsent, val: boolean) => {
    if (key === "analytics") setAnalytics(val);
    if (key === "marketing") setMarketing(val);
    if (key === "functional") setFunctional(val);
  };

  const { setRef: heroRef, inView: heroIn } = useInView();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#0e1f3d] to-[#1a3a6e] py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4a017]/10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div ref={(el) => heroRef(el)} className={`max-w-4xl mx-auto text-center relative transition-all duration-700 ${heroIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#d4a017] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            🍪 Privacy &amp; Cookies
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Cookie Policy</h1>
          <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
            We believe in transparency. This page explains exactly what cookies EJF uses, why we use them, and gives you full control over your preferences.
          </p>
          <p className="text-white/30 text-xs mt-3">Last updated: April 2026 &nbsp;·&nbsp; Economic Justice Forum (EJF)</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ── Current status ── */}
        <div className={`rounded-2xl border-2 p-5 ${consent ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{consent ? "✅" : "⏳"}</span>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm ${consent ? "text-emerald-800" : "text-amber-800"}`}>
                {consent ? "Your preferences are saved" : "You haven't set your preferences yet"}
              </h3>
              {consent ? (
                <p className="text-emerald-700 text-xs mt-1">
                  Choice: <span className="font-bold capitalize">{consent.decision === "all" ? "Accept All" : consent.decision === "essential" ? "Essential Only" : "Custom"}</span>
                  &nbsp;·&nbsp; Saved: {new Date(consent.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              ) : (
                <p className="text-amber-700 text-xs mt-1">Use the controls below to set your cookie preferences.</p>
              )}
            </div>
            {consent && (
              <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            ✓ Cookie preferences saved!
          </div>
        )}

        {/* ── What are cookies ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0e1f3d] mb-3">What are cookies?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            EJF stores all cookie preference data <strong>locally on your device</strong> using your browser's <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code>. We do not transmit your preference data to external servers. You can clear it at any time using the Reset button above.
          </p>
        </div>

        {/* ── Cookie categories with toggles ── */}
        <div>
          <h2 className="text-lg font-bold text-[#0e1f3d] mb-4">Cookie Categories &amp; Your Choices</h2>
          <div className="space-y-4">
            {cookieTypes.map((ct) => (
              <div key={ct.type} className={`rounded-2xl border ${ct.color} overflow-hidden`}>
                {/* Header row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ct.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#0e1f3d] text-sm">{ct.type}</h3>
                        {ct.always && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ct.badge}`}>Always Active</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {ct.examples.length} cookie{ct.examples.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={isChecked(ct.key)}
                    disabled={ct.always}
                    onChange={(val) => handleToggle(ct.key, val)}
                  />
                </div>

                {/* Details */}
                <div className="px-5 pb-5 border-t border-black/5">
                  <p className="text-gray-600 text-xs leading-relaxed mt-3 mb-3">{ct.desc}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 uppercase tracking-wider text-[10px]">
                          <th className="text-left pb-1.5 pr-4 font-semibold">Cookie Name</th>
                          <th className="text-left pb-1.5 pr-4 font-semibold">Purpose</th>
                          <th className="text-left pb-1.5 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ct.examples.map((ex) => (
                          <tr key={ex.name} className="border-t border-black/5">
                            <td className="py-1.5 pr-4 font-mono font-semibold text-[#0e1f3d]">{ex.name}</td>
                            <td className="py-1.5 pr-4 text-gray-600">{ex.purpose}</td>
                            <td className="py-1.5 text-gray-500 whitespace-nowrap">{ex.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Save preferences ── */}
        <div className="bg-gradient-to-r from-[#0e1f3d] to-[#1a3a6e] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-base mb-1">Save Your Preferences</h3>
            <p className="text-white/50 text-xs">Your choices are stored privately on your device only.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-xs font-semibold text-white/60 border border-white/20 hover:border-white/50 hover:text-white rounded-xl transition-all"
            >
              Essential Only
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl transition-all"
            >
              Save My Choices
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 text-xs font-bold bg-[#d4a017] hover:bg-[#b8891a] text-white rounded-xl transition-all hover:scale-105"
            >
              Accept All ✓
            </button>
          </div>
        </div>

        {/* ── How to manage via browser ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0e1f3d] mb-3">Managing cookies in your browser</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            You can also control cookies directly through your browser settings. Note that blocking all cookies may affect website functionality.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { browser: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { browser: "Firefox", url: "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" },
              { browser: "Safari", url: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac" },
              { browser: "Microsoft Edge", url: "https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" },
              { browser: "Opera", url: "https://help.opera.com/en/latest/web-preferences/" },
              { browser: "Brave", url: "https://support.brave.com/hc/en-us/articles/360022806212" },
            ].map((b) => (
              <a
                key={b.browser}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-[#0e1f3d] hover:text-[#d4a017] bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-[#d4a017]/30 px-3 py-2.5 rounded-xl transition-all"
              >
                <span className="text-[#d4a017]">↗</span> {b.browser}
              </a>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0e1f3d] mb-2">Questions?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            If you have any questions about how EJF uses cookies or how we handle your data, please contact us.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:info@economicjusticeforum.org" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e1f3d] hover:text-[#d4a017] bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-[#d4a017]/40 px-4 py-2.5 rounded-xl transition-all">
              ✉️ info@economicjusticeforum.org
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0e1f3d] hover:bg-[#1a3a6e] px-4 py-2.5 rounded-xl transition-all">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
