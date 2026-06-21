import { createFileRoute, Link } from "@tanstack/react-router";
import { BLOB, ExtLink, H1, H2, Lead, P, PrevNext, UL } from "@/components/docs/primitives";
import { ArrowRight, FileText, LayoutGrid, Search, MessageSquare, BarChart3, Minimize2, RefreshCw, Network, Activity, Terminal, Server } from "lucide-react";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "RAGForge Docs — Overview" },
      { name: "description", content: "RAGForge is a Python toolkit + HTTP API for building, evaluating, and shipping RAG. Start here." },
    ],
  }),
  component: Page,
});

const CARDS = [
  { to: "/docs/quickstart", icon: Terminal, t: "Quickstart", d: "Install, build a knowledge base, run your first query in 5 minutes." },
  { to: "/docs/architecture", icon: LayoutGrid, t: "Architecture", d: "How the modules connect via the plugin registry. Ingest and query flows." },
  { to: "/docs/cli", icon: Terminal, t: "CLI reference", d: "Every ragforge subcommand and flag, sourced from cli.py." },
  { to: "/docs/api", icon: Server, t: "HTTP API", d: "Every endpoint, request body and response shape." },
  { to: "/docs/modules", icon: FileText, t: "Python modules", d: "Public classes and functions across parsing, chunking, pipeline, etc." },
  { to: "/docs/evaluation", icon: BarChart3, t: "Evaluation", d: "Golden datasets, metrics, A/B compare." },
  { to: "/docs/coordination", icon: Network, t: "Multi-agent", d: "Blackboard-based coordination. How agents share state." },
  { to: "/docs/migration", icon: RefreshCw, t: "Migration", d: "Shadow-index a new embedding model, validate, then cut over." },
];

function Page() {
  return (
    <>
      <H1>RAGForge documentation</H1>
      <Lead>
        RAGForge is one toolkit for parsing, chunking, retrieval, grounded answers, evaluation,
        quantization, migration, and multi-agent coordination — exposed as an HTTP/JSON API so any
        language can use it. The core install has zero required dependencies.
      </Lead>
      <P>
        Source of truth is the repo: <ExtLink href={BLOB}>github.com/samsuljahith/RagForge</ExtLink>.
        Every page here links back to the code it describes.
      </P>

      <H2>Pipeline at a glance</H2>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch">
        {[
          { icon: FileText, l: "Parse" },
          { icon: LayoutGrid, l: "Chunk" },
          { icon: Search, l: "Retrieve" },
          { icon: MessageSquare, l: "Answer" },
        ].map((s, i, arr) => (
          <div key={s.l} className="flex flex-1 items-center gap-3">
            <div className="card-forge flex-1 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 font-semibold">{s.l}</div>
            </div>
            {i < arr.length - 1 && <ArrowRight className="hidden h-4 w-4 text-primary/60 md:block" />}
          </div>
        ))}
      </div>

      <H2>Start here</H2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="card-forge card-forge-hover block p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <c.icon className="h-4 w-4" />
            </div>
            <div className="mt-4 font-display text-lg font-bold">{c.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.d}</div>
          </Link>
        ))}
      </div>

      <H2>What's in core</H2>
      <UL>
        <li><b>Core</b> — Document / Chunk data models and the plugin registry.</li>
        <li><b>Parsing</b> — txt, md, html, pdf, and optional Docling for complex layouts.</li>
        <li><b>Chunking</b> — fixed sliding window, structure-aware, and Docling chunker.</li>
        <li><b>Pipeline</b> — embed + store + hybrid search (dense + BM25 via RRF) + cross-encoder rerank.</li>
        <li><b>Generation</b> — grounded answers with citations; refuses on insufficient evidence. OpenAI / Anthropic / Ollama.</li>
        <li><b>Evaluation</b> — hit_rate, MRR, precision@k, recall@k, faithfulness, answer relevance.</li>
        <li><b>Quantization</b> — compress embeddings; measure tradeoff on your own data.</li>
        <li><b>Migration</b> — shadow-index a new model, validate, atomic cutover.</li>
        <li><b>Coordination</b> — multi-agent blackboard so agents share state instead of messaging.</li>
        <li><b>Tracing & UI</b> — every query traced to SQLite; <code>ragforge ui</code> for a local dashboard.</li>
      </UL>

      <PrevNext next={{ to: "/docs/quickstart", label: "Quickstart" }} />
    </>
  );
}
