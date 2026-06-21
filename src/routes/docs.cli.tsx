import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, H3, Lead, P, PrevNext, Table } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/cli")({
  head: () => ({
    meta: [
      { title: "CLI reference — RAGForge" },
      { name: "description", content: "Every ragforge command and flag: parse, chunk, knowledge, query, eval, agents, serve, ui." },
    ],
  }),
  component: Page,
});

function FlagsTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <Table
      headers={["Flag", "Description"]}
      rows={rows.map(([flag, desc]) => [<Code key="f">{flag}</Code>, desc])}
    />
  );
}

function Page() {
  return (
    <>
      <H1>CLI reference</H1>
      <Lead>
        Every <Code>ragforge</Code> subcommand, sourced from{" "}
        <ExtLink href={`${BLOB}/ragforge/cli.py`}>ragforge/cli.py</ExtLink>.
      </Lead>

      <H2 id="info">ragforge info</H2>
      <P>List all registered plugin components (parsers, chunkers, embedders, metrics) and module status. No flags.</P>
      <CodeBlock lang="bash" code="ragforge info" />

      <H2 id="parse">ragforge parse</H2>
      <P>Parse a file into clean text. Auto-detects format by extension.</P>
      <CodeBlock lang="bash" code={`ragforge parse notes.md
ragforge parse report.pdf --parser docling --preview 1000`} />
      <FlagsTable rows={[
        ["--parser", "Parser backend: text, html, pdf, docling. Default: auto-detect."],
        ["--preview N", "Characters of text to show (default: 500)."],
        ["--json", "Output as JSON."],
      ]} />

      <H2 id="chunk">ragforge chunk</H2>
      <P>Parse then chunk a file.</P>
      <CodeBlock lang="bash" code={`ragforge chunk notes.md --strategy structure --max-tokens 384`} />
      <FlagsTable rows={[
        ["--parser", "Parser backend (same as parse)."],
        ["--strategy", "fixed | structure | docling. Default: structure."],
        ["--max-tokens N", "Target chunk size in tokens."],
        ["--show-text", "Print each chunk's text."],
        ["--json", "Output as JSON."],
      ]} />

      <H2 id="knowledge">ragforge knowledge build</H2>
      <P>Build a knowledge base from files or directories.</P>
      <CodeBlock lang="bash" code={`ragforge knowledge build my-kb ./docs/ faq.md
ragforge knowledge build my-kb ./docs/ --embedder sentence-transformers`} />
      <FlagsTable rows={[
        ["--strategy", "fixed | structure | docling (default: structure)."],
        ["--parser", "Parser backend."],
        ["--embedder", "default | sentence-transformers | openai."],
        ["--json", "Output as JSON."],
      ]} />

      <H2 id="query">ragforge query</H2>
      <P>Query a built knowledge base with hybrid search.</P>
      <CodeBlock lang="bash" code={`ragforge query my-kb "How do refunds work?"
ragforge query my-kb "refunds" -k 3 --mode hybrid --rerank
ragforge query my-kb "refunds" --generate --llm ollama --model llama3`} />
      <FlagsTable rows={[
        ["-k N", "Number of results (default: 5)."],
        ["--mode", "dense | bm25 | hybrid (default: hybrid)."],
        ["--rerank", "Apply cross-encoder reranking."],
        ["--generate", "Generate a grounded LLM answer."],
        ["--llm", "LLM provider: openai, anthropic, ollama."],
        ["--model", "Override default model for the LLM provider."],
        ["--json", "Output as JSON."],
      ]} />

      <H2 id="eval">ragforge eval</H2>

      <H3 id="eval-run">ragforge eval run</H3>
      <P>Evaluate a knowledge base against a golden dataset (JSON or CSV).</P>
      <CodeBlock lang="bash" code={`ragforge eval run my-kb golden.json
ragforge eval run my-kb golden.json --metrics hit_rate,mrr --rerank`} />
      <FlagsTable rows={[
        ["-k N", "Top-k for retrieval (default: 5)."],
        ["--mode", "Retrieval mode (default: hybrid)."],
        ["--rerank", "Apply reranking."],
        ["--generate", "Generate answers (required for judge metrics)."],
        ["--llm", "LLM provider."],
        ["--metrics", "Comma-separated metrics."],
        ["--json", "Output as JSON."],
      ]} />

      <H3 id="eval-compare">ragforge eval compare</H3>
      <P>A/B compare two knowledge bases on the same golden dataset.</P>
      <CodeBlock lang="bash" code={`ragforge eval compare my-kb-v1 my-kb-v2 golden.json`} />

      <H3 id="eval-bootstrap">ragforge eval bootstrap</H3>
      <P>Generate a draft golden dataset from an existing KB using an LLM. Human review required before use.</P>
      <CodeBlock lang="bash" code={`ragforge eval bootstrap my-kb -n 20 --llm ollama --out draft_golden.json`} />

      <H2 id="agents">ragforge agents</H2>

      <H3 id="agents-run">ragforge agents run</H3>
      <P>
        Run a multi-agent orchestration task from a Python config file. The config must define
        <Code>agents</Code> and optionally <Code>goal</Code>, <Code>max_steps</Code>,
        <Code>board_name</Code>, and <Code>seed</Code>.
      </P>
      <CodeBlock lang="bash" code={`ragforge agents run config.py --max-steps 20 --persist`} />
      <FlagsTable rows={[
        ["--max-steps N", "Maximum orchestration steps."],
        ["--persist", "Use SQLite-backed blackboard (default: in-memory)."],
        ["--json", "Output as JSON."],
      ]} />

      <H3 id="agents-benchmark">ragforge agents benchmark</H3>
      <P>Run a blackboard-vs-direct-messaging cost comparison.</P>
      <CodeBlock lang="bash" code={`ragforge agents benchmark config.py`} />

      <H3 id="agents-board">ragforge agents board</H3>
      <P>Inspect the current state of a named SQLite-backed blackboard.</P>
      <CodeBlock lang="bash" code={`ragforge agents board research-task`} />

      <H2 id="serve">ragforge serve</H2>
      <P>Start the HTTP/JSON API server.</P>
      <CodeBlock lang="bash" code={`ragforge serve --host 0.0.0.0 --port 8000`} />
      <FlagsTable rows={[
        ["--host", "Bind host (default: 0.0.0.0)."],
        ["--port N", "Port (default: 8000)."],
        ["--reload", "Enable auto-reload (development mode)."],
      ]} />

      <H2 id="ui">ragforge ui</H2>
      <P>Launch the local web dashboard (tracing, evaluation viewer, chat). Requires <Code>ragforge[ui]</Code>.</P>
      <CodeBlock lang="bash" code={`ragforge ui --port 8000`} />
      <FlagsTable rows={[
        ["--host", "Bind host."],
        ["--port N", "Port."],
        ["--no-browser", "Don't auto-open browser."],
      ]} />

      <PrevNext
        prev={{ to: "/docs/architecture", label: "Architecture" }}
        next={{ to: "/docs/api", label: "HTTP API" }}
      />
    </>
  );
}
