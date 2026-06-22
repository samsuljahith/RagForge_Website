import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Github,
  Copy,
  Check,
  FileText,
  LayoutGrid,
  Search,
  MessageSquare,
  BarChart3,
  Minimize2,
  RefreshCw,
  Network,
  Activity,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Server,
  Package,
  AlertTriangle,
  HelpCircle,
  Coins,
  Sparkles,
} from "lucide-react";
import mascot from "@/assets/mascot.png";
import samsul from "@/assets/samsul.png.asset.json";
import { Flow3D, type FlowStep } from "@/components/Flow3D";
import { Database, Boxes, Brain, Filter, Quote, Linkedin, Mail, FileWarning, Microscope, Rocket, Users2, GitMerge, Scale } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RAGForge — Build AI that reads your documents, honestly" },
      { name: "description", content: "Open-source toolkit for parsing, chunking, retrieval, grounded answers, and evaluation. One install, any language, runs locally." },
      { property: "og:title", content: "RAGForge — Open-source RAG toolkit" },
      { property: "og:description", content: "Parsing, chunking, retrieval, grounded answers, and evaluation — all in one place. Free and open source." },
    ],
  }),
  component: Landing,
});

const GITHUB = "https://github.com/samsuljahith/RagForge";
const INSTALL = "pip install ragforge";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("animate-fade-up");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function CopyPill({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="group inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2.5 font-mono text-sm text-foreground/90 backdrop-blur hover:border-primary/60 transition"
      aria-label="Copy install command"
    >
      <span className="text-primary">$</span>
      <span>{label ?? text}</span>
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
    </button>
  );
}

function Sparks() {
  const sparks = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {sparks.map((_, i) => {
        const left = 20 + ((i * 53) % 70);
        const delay = (i * 0.22) % 2.4;
        const dx = ((i % 5) - 2) * 14;
        return (
          <span
            key={i}
            className="absolute bottom-10 h-1.5 w-1.5 rounded-full bg-primary animate-spark"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              boxShadow: "0 0 12px var(--color-primary)",
              ["--dx" as never]: `${dx}px`,
            }}
          />
        );
      })}
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={mascot} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-extrabold tracking-tight">RAGForge</span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="hover:text-foreground transition">Problem</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#inside" className="hover:text-foreground transition">Modules</a>
          <Link to="/docs" className="hover:text-foreground transition">Docs</Link>
          <a href="#api" className="hover:text-foreground transition">API</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/docs"
            className="hidden rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition md:inline-flex"
          >
            Docs
          </Link>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:pt-28">
        <div data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Open-source RAG toolkit
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Build AI that reads your documents — and answers{" "}
            <span className="text-gradient-forge">honestly.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Parsing, chunking, retrieval, grounded answers, and evaluation — all in one place.
            Usable from any programming language. Runs on your own machine. Free and open source.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 glow-forge"
            >
              <Github className="h-4 w-4" /> View on GitHub
            </a>
            <CopyPill text={INSTALL} />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Apache-2.0</span>
            <span className="inline-flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Runs locally</span>
            <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> Any language via HTTP</span>
          </div>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-md md:h-[520px]" data-reveal>
          <div
            aria-hidden
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: "var(--gradient-radial-glow)" }}
          />
          <Sparks />
          <img
            src={mascot}
            alt="RAGForge mascot — a robot blacksmith forging a glowing AI cube on an anvil"
            width={520}
            height={520}
            className="relative z-10 mx-auto h-full w-auto animate-float drop-shadow-[0_20px_50px_rgba(249,115,22,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center" data-reveal>
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</span>
        )}
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
        {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-14">{children}</div>
    </section>
  );
}

const PROBLEMS = [
  {
    icon: AlertTriangle,
    title: "Documents get mangled",
    body: "Tables and code get chopped in half, so the AI reads broken pieces and gives wrong answers.",
  },
  {
    icon: HelpCircle,
    title: "You can't trust the answers",
    body: "The AI sometimes makes things up, with no sources you can check.",
  },
  {
    icon: Coins,
    title: "AI agents burn money",
    body: "When several agents talk to each other, every message costs — and it adds up fast.",
  },
];

function Problem() {
  return (
    <Section id="problem" eyebrow="The problem" title="Building RAG is messy" subtitle="You have a pile of documents. You want AI to answer questions from them — accurately. Doing it yourself means gluing together six fragile tools.">
      <div className="grid gap-6 md:grid-cols-3">
        {PROBLEMS.map((p) => (
          <div key={p.title} data-reveal className="card-forge card-forge-hover p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const PIPELINE = [
  { icon: FileText, label: "Parse", desc: "Read your files — PDF, Word, HTML, and more." },
  { icon: LayoutGrid, label: "Chunk", desc: "Split smartly. Tables and code stay whole." },
  { icon: Search, label: "Search", desc: "Hybrid retrieval (meaning + keywords) with reranking." },
  { icon: MessageSquare, label: "Answer", desc: "Grounded replies that cite their sources." },
];

function HowItWorks() {
  return (
    <Section id="how" eyebrow="How it works" title="One workshop for everything RAG">
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-stretch">
        {PIPELINE.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-4">
            <div data-reveal className="card-forge card-forge-hover flex-1 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg font-bold">{step.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
            </div>
            {i < PIPELINE.length - 1 && (
              <ArrowRight className="hidden h-5 w-5 shrink-0 text-primary/70 md:block" />
            )}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
        Everything is exposed over a simple HTTP API, so you can use it from any language — not just Python.
      </p>
    </Section>
  );
}

function MigrateBlind() {
  const steps = [
    { n: "01", t: "Test on your corpus", d: "Replay your real query logs as a frozen golden set." },
    { n: "02", t: "Gate the cutover", d: "New index must beat the old on recall@k and MRR — on YOUR data." },
    { n: "03", t: "Migrate the hot set first", d: "Re-embed only the small fraction of chunks queries actually hit." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div
        className="card-forge relative overflow-hidden p-10 md:p-14"
        data-reveal
        style={{
          background:
            "linear-gradient(135deg, oklch(0.24 0.04 40) 0%, oklch(0.22 0.025 40) 60%)",
        }}
      >
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "oklch(0.72 0.19 45 / 0.25)" }}
        />
        <div className="relative grid gap-10 md:grid-cols-5 md:items-start">
          <div className="md:col-span-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Featured</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight">Don't migrate blind</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              When a better embedding model comes out, should you even switch? RAGForge answers that
              before you spend a fortune re-embedding. Often a model that wins on public benchmarks
              loses on your domain.
            </p>
          </div>
          <div className="md:col-span-3 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MODULES: Array<{ icon: React.ComponentType<{ className?: string }>; name: string; desc: string; tint: string }> = [
  { icon: FileText, name: "Parsing", desc: "Read PDFs, Word, HTML, and more.", tint: "from-orange-400/20 to-orange-400/0" },
  { icon: LayoutGrid, name: "Chunking", desc: "Split smartly; keep tables and code intact.", tint: "from-emerald-400/20 to-emerald-400/0" },
  { icon: Search, name: "Retrieval", desc: "Hybrid search (dense + BM25) with reranking.", tint: "from-indigo-400/20 to-indigo-400/0" },
  { icon: MessageSquare, name: "Answers", desc: "Grounded responses that cite sources and refuse to guess.", tint: "from-violet-400/20 to-violet-400/0" },
  { icon: BarChart3, name: "Evaluation", desc: "Score retrieval and answer quality; A/B compare setups.", tint: "from-cyan-400/20 to-cyan-400/0" },
  { icon: Minimize2, name: "Quantization", desc: "Shrink embeddings to cut storage and cost.", tint: "from-amber-400/20 to-amber-400/0" },
  { icon: RefreshCw, name: "Migration", desc: "Swap embedding models safely, with quality validation.", tint: "from-sky-400/20 to-sky-400/0" },
  { icon: Network, name: "Multi-Agent", desc: "Coordinate agents through shared state, not expensive direct messaging.", tint: "from-pink-400/20 to-pink-400/0" },
  { icon: Activity, name: "Dashboard", desc: "Local UI to trace pipelines, run evaluations, and chat with your KB.", tint: "from-teal-400/20 to-teal-400/0" },
];

function Inside() {
  return (
    <Section id="inside" eyebrow="Everything inside" title="Nine building blocks" subtitle="Use what you need. Ignore the rest.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <div key={m.name} data-reveal className="card-forge card-forge-hover group relative overflow-hidden p-6">
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.tint} opacity-60 blur-2xl transition group-hover:opacity-100`} />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <m.icon className="h-5 w-5" />
            </div>
            <h3 className="relative mt-5 font-display text-lg font-bold">{m.name}</h3>
            <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const WHY = [
  { icon: Package, t: "All-in-one", d: "One install instead of six libraries to stitch together." },
  { icon: Globe2, t: "Any language", d: "It's a simple HTTP API — call it from Python, JavaScript, Go, anything." },
  { icon: Server, t: "Local & private", d: "Runs on your own machine; your documents never have to leave." },
  { icon: ShieldCheck, t: "Free & open source", d: "Apache-2.0. Use it, change it, build on top of it." },
];

function Why() {
  return (
    <Section eyebrow="Why RAGForge" title="No secret algorithms" subtitle="Just everything you need, made simple.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {WHY.map((w) => (
          <div key={w.t} data-reveal className="card-forge card-forge-hover p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <w.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold">{w.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const SNIPPETS = {
  python: `import requests

r = requests.post("http://localhost:8000/query", json={
    "knowledge": "my-kb",
    "question": "How do refunds work?",
    "top_k": 5,
    "generate": True,
})
print(r.json()["answer"])`,
  javascript: `const res = await fetch("http://localhost:8000/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    knowledge: "my-kb",
    question: "How do refunds work?",
    top_k: 5,
    generate: true,
  }),
});
const data = await res.json();
console.log(data.answer);`,
  curl: `curl -X POST http://localhost:8000/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "knowledge": "my-kb",
    "question": "How do refunds work?",
    "top_k": 5,
    "generate": true
  }' | jq`,
};

function ApiTabs() {
  const [tab, setTab] = useState<keyof typeof SNIPPETS>("python");
  const [copied, setCopied] = useState(false);
  const code = SNIPPETS[tab];
  return (
    <Section id="api" eyebrow="Any language" title="Plain HTTP. Any client." subtitle="It's just a JSON API. Call it from anywhere.">
      <div className="mx-auto max-w-4xl" data-reveal>
        <div className="card-forge overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 text-xs">
              {(Object.keys(SNIPPETS) as Array<keyof typeof SNIPPETS>).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`rounded-full px-3 py-1.5 font-mono transition ${
                    tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-primary"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto px-6 py-6 font-mono text-sm leading-relaxed text-foreground/90">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div
        className="card-forge relative overflow-hidden px-8 py-16 text-center md:px-16 md:py-20"
        data-reveal
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, oklch(0.72 0.19 45 / 0.22), transparent 70%), oklch(0.22 0.022 40)",
        }}
      >
        <img
          src={mascot}
          alt=""
          aria-hidden
          width={140}
          height={140}
          className="pointer-events-none absolute -bottom-4 right-4 h-32 w-32 opacity-80 md:right-10 md:h-40 md:w-40"
        />
        <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          Built. Working. <span className="text-gradient-forge">Open source.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Try it. Break it. Tell us what's missing.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 glow-forge"
          >
            <Github className="h-4 w-4" /> View on GitHub
          </a>
          <CopyPill text={INSTALL} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={mascot} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
          <span className="font-display font-bold text-foreground">RAGForge</span>
          <span className="ml-2">· Apache-2.0 · Free and open source · 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={GITHUB} target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition">GitHub</a>
          <a href={`${GITHUB}/issues`} target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition">Issues</a>
          <a href="https://pypi.org/project/ragforge/" target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition">PyPI</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  const wrap = useReveal();
  return (
    <div ref={wrap} className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <MigrateBlind />
        <Inside />
        <Why />
        <ApiTabs />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
