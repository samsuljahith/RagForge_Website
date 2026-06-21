import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, Lead, P, PrevNext, Table, UL } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — RAGForge" },
      { name: "description", content: "How RAGForge modules connect via the plugin registry. Ingest and query request flows. Data storage layout." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Architecture</H1>
      <Lead>
        How the modules connect, the plugin registry, and where data is stored. Sourced from{" "}
        <ExtLink href={`${BLOB}/README.md`}>README.md</ExtLink> and{" "}
        <ExtLink href={`${BLOB}/ragforge/core/registry.py`}>core/registry.py</ExtLink>.
      </Lead>

      <H2 id="layout">Module layout</H2>
      <CodeBlock
        lang="text"
        code={`ragforge/
├── core/           # Shared models (Document, Chunk) + plugin registry
├── parsing/        # File → Document (txt, md, html, pdf, docling)
├── chunking/       # Document → Chunks (fixed, structure, docling)
├── pipeline/       # Embed + store + retrieve + generate
│   ├── embeddings.py
│   ├── store.py
│   ├── bm25.py
│   ├── retriever.py
│   ├── generation.py
│   └── knowledge.py
├── evaluation/     # Measure retrieval + generation quality
├── quantization/   # Compress embeddings + measure tradeoff
├── migration/      # Swap embedding models safely
├── coordination/   # Multi-agent blackboard
├── tracing.py      # SQLite-backed trace store
├── api/            # FastAPI HTTP endpoints
│   └── routes/
├── cli.py          # Command-line interface
└── ui_static/      # Pre-built dashboard assets`}
      />

      <H2 id="registry">Plugin registry</H2>
      <P>
        Every capability registers itself via <Code>@register(kind, name)</Code>. The CLI and API
        look components up by name with <Code>get(kind, name)</Code> — they never import
        implementations directly. Adding a new parser, chunker, or metric is one new file. Current
        registry kinds: <Code>"parser"</Code>, <Code>"chunker"</Code>, <Code>"embedder"</Code>,{" "}
        <Code>"metric"</Code>.
      </P>
      <CodeBlock
        lang="python"
        code={`from ragforge.core.registry import register, get, available

@register("chunker", "fixed")
class FixedChunker(...):
    ...

chunker_cls = get("chunker", "fixed")
print(available("chunker"))  # ['fixed', 'structure', ...]`}
      />

      <H2 id="ingest">Request flow — ingest</H2>
      <CodeBlock
        lang="text"
        code={`CLI: ragforge knowledge build my-kb ./docs/
       ↓
pipeline.build_knowledge_base()
       ↓
  for each source file:
    parsing.parse_file()        → Document
    chunking.chunk_document()   → list[Chunk]
       ↓
  pipeline.embeddings.encode(chunks)   → vectors
       ↓
  pipeline.store.InMemoryStore.add(chunks, vectors)
  pipeline.bm25.BM25Index.add(chunks)
       ↓
  persist to ~/.ragforge/knowledge_bases/<name>/
    vectors.json, bm25_index.json, meta.json`}
      />

      <H2 id="query">Request flow — query</H2>
      <CodeBlock
        lang="text"
        code={`CLI/API: ragforge query my-kb "How do refunds work?"
       ↓
pipeline.query_knowledge_base()
       ↓
  KnowledgeBase.load("my-kb")   ← reads from ~/.ragforge/
       ↓
  kb.query(question, mode="hybrid")
    ↓ dense: embedder.encode_single(question) → store.search()
    ↓ bm25:  bm25_index.search(question)
    ↓ hybrid: RRF fusion of both ranked lists
       ↓
  [optional] cross-encoder reranking
       ↓
  [optional] generation.LLMProvider.generate(prompt, context_chunks)
       ↓
  tracing.Tracer records each step → ~/.ragforge/traces.db
       ↓
  return { chunks, answer }`}
      />

      <H2 id="storage">Data storage</H2>
      <Table
        headers={["Data", "Path"]}
        rows={[
          ["Knowledge bases", <Code key="1">~/.ragforge/knowledge_bases/&lt;name&gt;/</Code>],
          ["Vector store", <Code key="2">vectors.json</Code>],
          ["BM25 index", <Code key="3">bm25_index.json</Code>],
          ["KB metadata", <Code key="4">meta.json</Code>],
          ["Migration backup", <Code key="5">vectors_backup.json</Code>],
          ["Traces", <Code key="6">~/.ragforge/traces.db</Code>],
          ["Blackboards", <Code key="7">~/.ragforge/&lt;board&gt;.db</Code>],
        ]}
      />

      <H2 id="env">Environment & config</H2>
      <UL>
        <li>No dedicated <Code>.env</Code> template; LLM providers use their own SDK env vars (<Code>OPENAI_API_KEY</Code>, <Code>ANTHROPIC_API_KEY</Code>).</li>
        <li>Ollama defaults to <Code>http://localhost:11434</Code>.</li>
        <li>Server defaults: <Code>--host 0.0.0.0 --port 8000</Code>.</li>
      </UL>

      <PrevNext
        prev={{ to: "/docs/quickstart", label: "Quickstart" }}
        next={{ to: "/docs/cli", label: "CLI reference" }}
      />
    </>
  );
}
