import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — RAGForge" },
      { name: "description", content: "Documentation for RAGForge: quickstart, CLI, HTTP API, Python modules, architecture, evaluation, coordination, and migration." },
      { property: "og:title", content: "RAGForge Documentation" },
      { property: "og:description", content: "Everything you need to build, evaluate, and ship RAG with RAGForge." },
    ],
  }),
  component: DocsLayout,
});

const GITHUB = "https://github.com/samsuljahith/RagForge";

const NAV: Array<{ section: string; items: Array<{ to: string; label: string }> }> = [
  {
    section: "Getting started",
    items: [
      { to: "/docs", label: "Overview" },
      { to: "/docs/quickstart", label: "Quickstart" },
      { to: "/docs/architecture", label: "Architecture" },
    ],
  },
  {
    section: "Reference",
    items: [
      { to: "/docs/cli", label: "CLI reference" },
      { to: "/docs/api", label: "HTTP API" },
      { to: "/docs/modules", label: "Python modules" },
    ],
  },
  {
    section: "Workflows",
    items: [
      { to: "/docs/evaluation", label: "Evaluation" },
      { to: "/docs/coordination", label: "Multi-agent" },
      { to: "/docs/migration", label: "Migration" },
    ],
  },
];

function Sidebar({ onNav }: { onNav?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav className="space-y-7 text-sm">
      {NAV.map((s) => (
        <div key={s.section}>
          <div className="mb-2 px-3 font-mono text-xs uppercase tracking-widest text-primary">
            {s.section}
          </div>
          <ul className="space-y-0.5">
            {s.items.map((item) => {
              const active =
                item.to === "/docs"
                  ? pathname === "/docs"
                  : pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNav}
                    className={`block rounded-lg px-3 py-2 transition ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function DocsLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={mascot} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-display text-lg font-extrabold tracking-tight">RAGForge</span>
            <span className="ml-2 rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">docs</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">
              ← Back to site
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-md border border-border p-2 md:hidden"
              aria-label="Toggle docs menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[240px_1fr] md:py-14">
        <aside className="hidden md:block">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </aside>

        {open && (
          <div className="md:hidden">
            <Sidebar onNav={() => setOpen(false)} />
          </div>
        )}

        <main className="min-w-0">
          <article className="prose-invert max-w-3xl">
            <Outlet />
          </article>
        </main>
      </div>
    </div>
  );
}
