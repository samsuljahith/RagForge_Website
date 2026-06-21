import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, H3, Lead, P, PrevNext, Table } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/api")({
  head: () => ({
    meta: [
      { title: "HTTP API reference — RAGForge" },
      { name: "description", content: "Every RAGForge HTTP endpoint: parse, chunk, knowledge, query, evaluate, quantize, migrate, traces, coordination." },
    ],
  }),
  component: Page,
});

function Method({ m, path }: { m: string; path: string }) {
  const color =
    m === "GET" ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/30" :
    m === "POST" ? "bg-primary/15 text-primary border-primary/30" :
    "bg-rose-400/15 text-rose-300 border-rose-400/30";
  return (
    <div className="mt-2 flex items-center gap-3">
      <span className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-xs font-semibold ${color}`}>
        {m}
      </span>
      <code className="font-mono text-sm text-foreground">{path}</code>
    </div>
  );
}

function Page() {
  return (
    <>
      <H1>HTTP API reference</H1>
      <Lead>
        Start the server with <Code>ragforge serve</Code>. Interactive Swagger UI at{" "}
        <Code>/docs</Code>. Route source:{" "}
        <ExtLink href={`${BLOB}/ragforge/api/routes`}>ragforge/api/routes/</ExtLink>.
      </Lead>

      <H2 id="health">Health</H2>
      <Method m="GET" path="/health" />
      <P>Server status and version.</P>

      <H2 id="capabilities">Capabilities</H2>
      <Method m="GET" path="/capabilities" />
      <P>List all registered parsers, chunkers, embedders, and metrics.</P>

      <H2 id="parse">Parse</H2>
      <Method m="POST" path="/parse" />
      <P>Parse a file path on the server, or raw text, into a Document. Provide either <Code>path</Code> or <Code>text</Code>.</P>
      <H3>Request</H3>
      <CodeBlock lang="json" code={`{
  "path":     "optional/server/path/to/file.pdf",
  "text":     "# Optional raw text content",
  "doc_type": "txt | md | html",
  "source":   "api-input",
  "parser":   "text | html | pdf | docling | null (auto-detect)"
}`} />
      <H3>Response</H3>
      <CodeBlock lang="json" code={`{
  "id":          "a1b2c3d4",
  "text":        "Extracted plain text…",
  "source":      "api-input",
  "doc_type":    "md",
  "metadata":    {},
  "token_count": 142
}`} />

      <H2 id="chunk">Chunk</H2>
      <Method m="POST" path="/chunk" />
      <CodeBlock lang="json" code={`{
  "document": { /* DocumentResponse object */ },
  "strategy": "structure | fixed | docling",
  "options":  { "max_tokens": 384 }
}`} />
      <P>Returns an array of chunk objects (<Code>id</Code>, <Code>text</Code>, <Code>doc_id</Code>, <Code>index</Code>, <Code>metadata</Code>, <Code>token_count</Code>).</P>

      <H2 id="knowledge">Knowledge</H2>
      <Method m="POST" path="/knowledge" />
      <P>Build and index a knowledge base from source paths.</P>
      <H3>Request</H3>
      <CodeBlock lang="json" code={`{
  "name":            "my-kb",
  "sources":         ["./docs/", "faq.md"],
  "embedding_model": "default | sentence-transformers | openai",
  "chunk_strategy":  "structure | fixed",
  "chunk_options":   { "max_tokens": 384 }
}`} />
      <H3>Response</H3>
      <CodeBlock lang="json" code={`{
  "name":            "my-kb",
  "status":          "built",
  "num_documents":   12,
  "num_chunks":      87,
  "embedding_model": "default"
}`} />

      <H2 id="query">Query</H2>
      <Method m="POST" path="/query" />
      <P>Retrieve chunks and optionally generate an LLM answer.</P>
      <H3>Request</H3>
      <CodeBlock lang="json" code={`{
  "knowledge": "my-kb",
  "question":  "How do refunds work?",
  "top_k":     5,
  "mode":      "hybrid | dense | bm25",
  "rerank":    false,
  "generate":  false,
  "llm":       "openai | anthropic | ollama | null",
  "model":     null
}`} />
      <H3>Response</H3>
      <CodeBlock lang="json" code={`{
  "question":  "How do refunds work?",
  "knowledge": "my-kb",
  "chunks": [
    {
      "id":       "a1b2c3d4",
      "text":     "All purchases are eligible…",
      "doc_id":   "b2c3d4e5",
      "index":    0,
      "metadata": { "section": "Refund Policy" },
      "score":    0.9234
    }
  ],
  "answer": "Based on the provided context, refunds are…",
  "llm":    "ollama"
}`} />

      <H2 id="evaluate">Evaluate</H2>
      <Method m="POST" path="/evaluate" />
      <CodeBlock lang="json" code={`{
  "knowledge": "my-kb",
  "golden_dataset": [
    {
      "question":            "What is the refund window?",
      "expected_answer":     "30 days",
      "relevant_chunk_ids":  ["a1b2c3d4"],
      "relevant_sources":    ["refund_policy.md"],
      "notes":               ""
    }
  ],
  "metrics":  ["hit_rate", "precision_at_k", "recall_at_k", "mrr"],
  "top_k":    5,
  "mode":     "hybrid",
  "rerank":   false,
  "generate": false,
  "llm":      null
}`} />

      <H2 id="quantize">Quantize</H2>
      <Method m="POST" path="/quantize" />
      <CodeBlock lang="json" code={`{
  "target":    "model-name",
  "knowledge": "my-kb",
  "options":   { "bits": 8, "method": "scalar" }
}`} />
      <P>Returns a before/after report with size, latency, quality delta, and cost reduction.</P>

      <H2 id="migrate">Migrate</H2>
      <Method m="POST" path="/migrate" />
      <CodeBlock lang="json" code={`{
  "knowledge":      "my-kb",
  "from_model":     "default",
  "to_model":       "openai",
  "run_validation": true,
  "options":        {}
}`} />
      <P>See <a className="text-primary underline underline-offset-4" href="/docs/migration">Migration</a> for the full process.</P>

      <H2 id="traces">Traces</H2>
      <Method m="GET" path="/traces?limit=50&offset=0" />
      <P>List recent pipeline traces.</P>
      <Method m="GET" path="/traces/{run_id}" />
      <P>Full trace detail (retrieval, rerank, prompt, response) with timing data.</P>

      <H2 id="coordination">Coordination</H2>
      <Table
        headers={["Method + Path", "Description"]}
        rows={[
          [<Code key="1">POST /coordination/boards</Code>, "Create a named blackboard ({ name, persist })."],
          [<Code key="2">GET /coordination/boards/{`{name}`}</Code>, "Get current board state."],
          [<Code key="3">POST /coordination/boards/{`{name}`}/write</Code>, "Write an entry ({ key, value, author, tags })."],
          [<Code key="4">GET /coordination/boards/{`{name}`}/history</Code>, "Full write history."],
          [<Code key="5">DELETE /coordination/boards/{`{name}`}</Code>, "Clear/delete a board."],
          [<Code key="6">POST /coordination/run</Code>, "Run an inline multi-agent orchestration task."],
          [<Code key="7">GET /coordination/run/{`{run_id}`}</Code>, "Trace + cost summary of a run."],
        ]}
      />

      <PrevNext
        prev={{ to: "/docs/cli", label: "CLI reference" }}
        next={{ to: "/docs/modules", label: "Python modules" }}
      />
    </>
  );
}
