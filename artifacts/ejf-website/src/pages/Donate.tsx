import { useState, useEffect, useRef, FormEvent } from "react";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const AMOUNTS = [500, 1000, 2500, 5000];

const programs = [
  { emoji: "⛅", bg: "bg-blue-50", title: "Climate Early Warning", desc: "Real-time weather stations, SMS/WhatsApp alerts, youth trained as Climate Data Stewards.", stat: "1,000+ farmers using climate-informed planning", status: "Active" },
  { emoji: "💻", bg: "bg-emerald-50", title: "BPO & Digital Jobs", desc: "2,000 direct jobs, digital cooperatives, link to global digital economy.", stat: "2,000 direct jobs created", status: "Active" },
  { emoji: "🤖", bg: "bg-amber-50", title: "STEM & Coding", desc: "20 schools, hackathons, mentorship, early STEM interest in rural learners.", stat: "20 schools engaged in STEM & coding", status: "Active" },
  { emoji: "🌱", bg: "bg-green-50", title: "Green Farming", desc: "Climate-smart agriculture, soil restoration, agroforestry for food security.", stat: "500+ farmers trained in green farming", status: "Active" },
  { emoji: "🏗️", bg: "bg-violet-50", title: "Smart Infrastructure", desc: "Solar-powered facilities, green construction, community workspaces and labs.", stat: "3 community hubs under development", status: "Active" },
  { emoji: "🌐", bg: "bg-pink-50", title: "Digital Connectivity", desc: "Broadband access, community Wi-Fi, digital literacy for underserved populations.", stat: "10,000+ community members connected", status: "Active" },
];

const steps = [
  { num: "1", title: "Build", desc: "Construct smart, green, and climate-smart facilities: labs, conference halls, workspaces, gardens" },
  { num: "2", title: "Equip", desc: "Furnish labs with state-of-the-art digital tools, robotics kits, renewable energy systems, AI applications, and weather stations" },
  { num: "3", title: "Empower", desc: "Train youth, women, PWDs, farmers, and artisanal miners in digital, green, blue economy skills" },
];

/* ─────────────────────────────────────────────
   DONATION MODAL
───────────────────────────────────────────── */
function DonationModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState<number | null>(1000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"card" | "paypal" | "mpesa">("mpesa");
  const [anon, setAnon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const finalAmount = custom ? parseInt(custom) || 0 : (amount ?? 0);

  const inputClass = (f: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-800 outline-none transition-all duration-200 ${
      focused === f ? "border-[#d4a017] ring-2 ring-[#d4a017]/20" : "border-gray-200 hover:border-gray-300"
    }`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  };

  // Close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null);

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" ref={backdropRef} onClick={(e) => e.target === backdropRef.current && onClose()}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-[#0e1f3d] mb-2">Thank You!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Your donation of <span className="font-bold text-[#d4a017]">KES {finalAmount.toLocaleString()}</span> has been received.
          </p>
          <p className="text-gray-400 text-xs mb-6">Payment integration coming soon. Your intent has been recorded.</p>
          <button onClick={onClose} className="w-full bg-[#0e1f3d] hover:bg-[#1a3a6e] text-white font-bold py-3 rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0e1f3d] to-[#1a3a6e] rounded-t-3xl p-5 flex items-start justify-between">
          <div>
            <h2 className="text-white font-bold text-lg leading-snug">Support the Green Digital Justice Hub</h2>
            <p className="text-white/60 text-xs mt-1">Your contribution empowers marginalized communities in Kenya</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none mt-0.5 flex-shrink-0 ml-3">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount selector */}
          <div>
            <label className="block text-sm font-bold text-[#0e1f3d] mb-3">Select Donation Amount</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a} type="button"
                  onClick={() => { setAmount(a); setCustom(""); }}
                  className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${
                    amount === a && !custom
                      ? "border-[#0e1f3d] bg-[#0e1f3d] text-white scale-105 shadow-md"
                      : "border-gray-200 hover:border-[#0e1f3d] text-gray-700"
                  }`}
                >
                  KES {a.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-1.5">Or enter custom amount</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">KES</span>
              <input
                type="number" min="50" placeholder="Enter amount"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
                onFocus={() => setFocused("custom")} onBlur={() => setFocused(null)}
                className={`${inputClass("custom")} pl-12`}
              />
            </div>
            {finalAmount > 0 && (
              <p className="text-xs text-emerald-600 font-semibold mt-1.5">✓ Donating KES {finalAmount.toLocaleString()}</p>
            )}
          </div>

          {/* Info */}
          <div>
            <label className="block text-sm font-bold text-[#0e1f3d] mb-3">Your Information</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" placeholder="Full Name" required={!anon}
                disabled={anon} value={name} onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                className={`${inputClass("name")} ${anon ? "bg-gray-50 text-gray-400" : ""}`}
              />
              <input
                type="email" placeholder="Email Address" required={!anon}
                disabled={anon} value={email} onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                className={`${inputClass("email")} ${anon ? "bg-gray-50 text-gray-400" : ""}`}
              />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-sm font-bold text-[#0e1f3d] mb-3">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "card", icon: "💳", label: "Credit Card" },
                { id: "paypal", icon: "🅿️", label: "PayPal" },
                { id: "mpesa", icon: "📱", label: "M-Pesa" },
              ] as const).map((m) => (
                <button
                  key={m.id} type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    method === m.id
                      ? "border-[#0e1f3d] bg-[#0e1f3d] text-white shadow-md"
                      : "border-gray-200 hover:border-[#0e1f3d] text-gray-600"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
            {method === "mpesa" && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-green-700 font-medium">
                📱 M-Pesa integration will be configured soon. Till/Paybill details coming.
              </div>
            )}
            {method === "card" && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-blue-700 font-medium">
                💳 Stripe card payment integration coming soon.
              </div>
            )}
            {method === "paypal" && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-blue-700 font-medium">
                🅿️ PayPal integration coming soon.
              </div>
            )}
          </div>

          {/* Anonymous */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)}
              className="w-4 h-4 rounded accent-[#d4a017]"
            />
            <span className="text-sm text-gray-600">Donate anonymously</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || finalAmount <= 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0e1f3d] to-[#1a3a6e] hover:opacity-90 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 rounded-xl text-base transition-all hover:scale-[1.02] shadow-lg"
          >
            {loading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
              : <>🔒 Complete Donation — KES {finalAmount > 0 ? finalAmount.toLocaleString() : "…"}</>
            }
          </button>
          <p className="text-center text-xs text-gray-400">Your donation is secure and encrypted. EJF is a registered non-profit organization.</p>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function FundraisingProgress() {
  const { ref, inView } = useInView();
  const [animated, setAnimated] = useState(false);
  const donors = useCounter(327, animated);
  const pct = 65;

  useEffect(() => { if (inView) setTimeout(() => setAnimated(true), 300); }, [inView]);

  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0e1f3d] mb-1">Fundraising Progress</h2>
        <p className="text-gray-400 text-sm">Help us reach our goal to establish the Green Digital Justice Hub</p>
      </div>
      <div ref={ref} className={`max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-[#0e1f3d]">$48,250 raised of $75,000 goal</span>
          <span className="font-bold text-[#d4a017]">{pct}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-[#d4a017] to-amber-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: inView ? `${pct}%` : "0%" }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#0e1f3d]">{donors.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium">Donors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#d4a017]">28</p>
            <p className="text-xs text-gray-400 font-medium">Days Left</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0e1f3d]">8</p>
            <p className="text-xs text-gray-400 font-medium">Programs</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function DonateHero({ onDonate }: { onDonate: () => void }) {
  return (
    <section className="relative overflow-hidden min-h-[480px] flex items-center">
      <img
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80"
        alt="Community"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1f3d]/85 via-[#0e1f3d]/70 to-transparent" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative max-w-4xl mx-auto px-4 py-16">
        <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#d4a017] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
          🌿 Green Digital Justice Hub
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Green Digital<br />Justice Hub
        </h1>
        <p className="text-white font-bold text-base md:text-lg mb-2">
          Bold Climate Action, Digital Innovation &amp; Inclusive Prosperity
        </p>
        <p className="text-white/70 text-sm max-w-xl mb-8 leading-relaxed">
          Empowering marginalized communities in Taita Taveta, coastal Kenya, and other arid areas while linking local innovation to global climate action and technology networks.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDonate}
            className="flex items-center gap-2 bg-[#d4a017] hover:bg-[#b8891a] text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:scale-105 shadow-xl"
          >
            🤝 Donate Now
          </button>
          <a
            href="#why"
            className="flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-white/10"
          >
            Learn More ↓
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHY IT MATTERS
───────────────────────────────────────────── */
function WhyItMatters() {
  const { ref, inView } = useInView();
  const points = [
    "Smart and green construction of facilities",
    "Green innovation labs and startup incubators",
    "Digitalized conference and workspace facilities",
    "Green gardens and climate-smart research facilities",
    "Integration with modern technology companies, using the latest digital, AI, and renewable technologies",
  ];
  return (
    <section id="why" className="bg-white py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0e1f3d] text-center mb-8">Why It Matters</h2>
        <div ref={ref} className={`bg-gray-50 rounded-2xl border border-gray-100 shadow-sm p-7 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            The Green Digital Justice Hub (GDJH) will be the first of its kind in grassroots, rural, and marginalized communities, and a model for Africa for community-led, bold climate action for economic justice.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Marginalized communities in Taita Taveta, the coastal region, and other arid and semi-arid areas protect and conserve natural resources yet face the harshest climate impacts and receive little to nothing.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            GDJH, led by the Economic Justice Forum (EJF), is a comprehensive, state-of-the-art project that combines:
          </p>
          <ul className="space-y-2 mb-5">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-gray-700">
                <span className="text-[#d4a017] font-bold flex-shrink-0 mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="text-gray-700 text-sm leading-relaxed">
            This hub will act as a community global resource, linking local initiatives to global climate action programs, COP30 commitments, SDGs, UNEP Digital Public Goods initiatives, and other cutting-edge international frameworks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROGRAMS & IMPACT
───────────────────────────────────────────── */
function ProgramsImpact() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0e1f3d] mb-1">Programs &amp; Impact</h2>
          <p className="text-gray-400 text-sm">The Green Digital Justice Hub will deliver impact across multiple areas</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p, i) => (
            <div
              key={p.title}
              className={`${p.bg} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#0e1f3d] text-sm">{p.title}</h3>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">{p.status}</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">{p.desc}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span>👥</span> {p.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   KEY OUTCOMES
───────────────────────────────────────────── */
function KeyOutcomes() {
  const { ref, inView } = useInView();
  const [animated, setAnimated] = useState(false);
  const v1 = useCounter(500, animated);
  const v2 = useCounter(1000, animated);
  const v3 = useCounter(20, animated);
  const v4 = useCounter(2000, animated);
  useEffect(() => { if (inView) setTimeout(() => setAnimated(true), 200); }, [inView]);

  const stats = [
    { val: v1, suffix: "+", label: "Youth & Women Trained", color: "text-[#0e1f3d]" },
    { val: v2, suffix: "+", label: "Farmers Using Climate Planning", color: "text-[#0e1f3d]" },
    { val: v3, suffix: "", label: "Schools in STEM Programs", color: "text-[#0e1f3d]" },
    { val: v4, suffix: "", label: "Direct Jobs Created", color: "text-[#d4a017]" },
  ];

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0e1f3d] mb-1">Key Outcomes</h2>
          <p className="text-gray-400 text-sm">The Green Digital Justice Hub will deliver measurable impact</p>
        </div>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`bg-gray-50 rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p className={`text-3xl font-black ${s.color} mb-1 tabular-nums`}>{s.val.toLocaleString()}{s.suffix}</p>
              <p className="text-xs text-gray-500 font-medium leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW DONATIONS WORK
───────────────────────────────────────────── */
function HowItWorks({ onDonate }: { onDonate: () => void }) {
  const { ref, inView } = useInView();
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0e1f3d] mb-1">How Donations Make It Successful</h2>
          <p className="text-gray-400 text-sm">Your contribution follows a clear path to impact</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`text-center transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg ${i === 0 ? "bg-[#d4a017] text-white" : "bg-gray-200 text-[#0e1f3d]"}`}>
                {s.num}
              </div>
              <h3 className="font-bold text-[#0e1f3d] text-base mb-2">{s.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Inline mini donation CTA */}
        <div className="bg-gradient-to-r from-[#0e1f3d] to-[#1a3a6e] rounded-2xl p-7 text-center shadow-xl">
          <h3 className="text-white font-bold text-lg mb-1">Ready to Make a Difference?</h3>
          <p className="text-white/60 text-sm mb-5">Every contribution, big or small, helps build a just and green future.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={onDonate}
                className="bg-white/10 hover:bg-[#d4a017] border border-white/20 hover:border-[#d4a017] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105"
              >
                KES {a.toLocaleString()}
              </button>
            ))}
            <button
              onClick={onDonate}
              className="bg-[#d4a017] hover:bg-[#b8891a] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            >
              Custom Amount
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function Donate() {
  const [modalOpen, setModalOpen] = useState(false);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <>
      <DonateHero onDonate={() => setModalOpen(true)} />
      <WhyItMatters />
      <FundraisingProgress />
      <ProgramsImpact />
      <KeyOutcomes />
      <HowItWorks onDonate={() => setModalOpen(true)} />
      {modalOpen && <DonationModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
