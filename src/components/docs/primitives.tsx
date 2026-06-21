import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export const REPO = "https://github.com/samsuljahith/RagForge";
export const BLOB = `${REPO}/blob/main`;

export function CodeBlock({
  code,
  lang = "bash",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card-forge my-5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {filename ?? lang}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-primary"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">{children}</h1>;
}
export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-lg text-muted-foreground">{children}</p>;
}
export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-24 font-display text-2xl font-bold tracking-tight md:text-3xl">
      {children}
    </h2>
  );
}
export function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mt-10 scroll-mt-24 font-display text-xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}
export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 leading-relaxed text-foreground/85">{children}</p>;
}
export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm text-muted-foreground">{children}</p>;
}
export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground/85 marker:text-primary">{children}</ul>;
}
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}
export function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </a>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="card-forge mt-5 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-background/40">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-foreground/85">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrevNext({
  prev,
  next,
}: {
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
}) {
  return (
    <div className="mt-16 grid gap-4 border-t border-border pt-8 md:grid-cols-2">
      {prev ? (
        <Link to={prev.to} className="card-forge card-forge-hover block p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">← Previous</div>
          <div className="mt-1 font-semibold text-foreground">{prev.label}</div>
        </Link>
      ) : <div />}
      {next ? (
        <Link to={next.to} className="card-forge card-forge-hover block p-5 text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Next →</div>
          <div className="mt-1 font-semibold text-foreground">{next.label}</div>
        </Link>
      ) : <div />}
    </div>
  );
}
