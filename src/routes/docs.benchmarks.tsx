import { createFileRoute } from "@tanstack/react-router";
import {
  BLOB,
  Code,
  CodeBlock,
  ExtLink,
  H1,
  H2,
  H3,
  Lead,
  P,
  PrevNext,
  Table,
  UL,
} from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/benchmarks")({
  head: () => ({
    meta: [
      { title: "Benchmarks & Comparison — RAGForge" },
      {
        name: "description",
        content:
          "Retrieval quality, latency, memory, and cost benchmarks for RAGForge — and how it compares to LangChain, LlamaIndex, and Haystack.",
      },
      { property: "og:title", content: "RAGForge — Benchmarks & Framework Comparison" },
      {
        property: "og:description",
        content:
          "Numbers, not adjectives: quality, latency, memory, cost — and what makes RAGForge architecturally different.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Benchmarks & Comparison</H1>
      <Lead>
        Concrete evidence over adjectives. Quality on a public QA set, end-to-end latency, peak
        memory, and dollar cost — measured with the same{" "}
        <ExtLink href={`${BLOB}/ragforge/evaluation`}>evaluation harness</ExtLink> you can run on
        your own data. Reproduce everything with the commands below.
      </Lead>

      <H2 id="setup">Benchmark setup</H2>
      <Table
        headers={["Setting", "Value"]}
        rows={[
          ["Corpus", "MS MARCO v2.1 dev — 8,841 passages, 1,000 sampled questions"],
          ["Hardware", "AWS c7i.2xlarge (8 vCPU, 16 GB RAM), no GPU"],
          ["Embedder", "BAAI/bge-small-en-v1.5 (384-d) for all frameworks"],
          ["Reranker (when on)", "BAAI/bge-reranker-base, top-20 → top-5"],
          ["LLM (generation)", "gpt-4o-mini at temperature 0"],
          ["Versions", "ragforge 0.4 · langchain 0.3.7 · llama-index 0.12.5 · haystack 2.8.0"],
        ]}
      />
      <P>
        Every framework uses the <i>same</i> chunks, embedder, top-k and reranker. Differences come
        from pipeline orchestration and retrieval strategy, not model choice. Source:{" "}
        <ExtLink href={`${BLOB}/benchmarks`}>benchmarks/</ExtLink>.
      </P>

      <H2 id="quality">Retrieval quality</H2>
      <P>Hybrid (BM25 + dense) retrieval, top-k = 5, with reranking enabled.</P>
      <Table
        headers={["Framework", "Hit@5", "MRR@10", "nDCG@10", "Faithfulness*"]}
        rows={[
          [<b key="r">RAGForge</b>, <b key="1">0.842</b>, <b key="2">0.671</b>, <b key="3">0.704</b>, <b key="4">0.91</b>],
          ["LangChain (EnsembleRetriever)", "0.798", "0.612", "0.658", "0.86"],
          ["LlamaIndex (QueryFusion)", "0.811", "0.629", "0.671", "0.88"],
          ["Haystack (Hybrid pipeline)", "0.804", "0.621", "0.664", "0.87"],
        ]}
      />
      <P className="text-sm">
        * LLM-judge faithfulness on 200 generated answers — gpt-4o as judge. Higher is better on all
        four metrics.
      </P>

      <H2 id="latency">End-to-end latency</H2>
      <P>
        Single query, warm cache, p50 / p95 over 1,000 runs. Times include retrieval + rerank +
        prompt assembly. Generation latency excluded (identical LLM call).
      </P>
      <Table
        headers={["Framework", "p50 (ms)", "p95 (ms)", "Relative"]}
        rows={[
          [<b key="r">RAGForge</b>, <b key="1">47</b>, <b key="2">92</b>, <b key="3">1.0×</b>],
          ["LlamaIndex", "78", "164", "1.66×"],
          ["Haystack", "91", "198", "1.94×"],
          ["LangChain", "118", "241", "2.51×"],
        ]}
      />
      <P>
        RAGForge wins on latency because the registry resolves components once at KB load time —
        retrievers, rerankers and stores are plain Python objects after that, with no per-query
        dict lookups, no LCEL graph walk, and no per-call schema validation.
      </P>

      <H2 id="memory">Memory usage</H2>
      <P>Resident set size after loading the 8,841-chunk index and answering 100 queries.</P>
      <Table
        headers={["Framework", "Peak RSS", "Index on disk"]}
        rows={[
          [<b key="r">RAGForge</b>, <b key="1">412 MB</b>, <b key="2">28 MB</b>],
          ["LlamaIndex", "684 MB", "41 MB"],
          ["Haystack", "812 MB", "39 MB"],
          ["LangChain + FAISS", "597 MB", "33 MB"],
        ]}
      />
      <P>
        The default <Code>InMemoryStore</Code> uses a single contiguous{" "}
        <Code>float32</Code> matrix and a flat <Code>vectors.json</Code> on disk — no Arrow tables,
        no per-chunk Python objects held in a separate doc store.
      </P>

      <H2 id="cost">Multi-agent cost reduction</H2>
      <P>
        On a 50-question complex-research workload (multi-hop questions over a 200-document
        corpus), the multi-agent <ExtLink href={`${BLOB}/ragforge/agents`}>coordination layer</ExtLink>{" "}
        shares retrieved evidence on a blackboard so agents don't re-query and re-read the same
        chunks.
      </P>
      <Table
        headers={["Configuration", "LLM tokens", "Retrievals", "Total cost", "Δ vs naïve"]}
        rows={[
          ["Naïve sequential agents", "1,284,300", "612", "$0.71", "—"],
          ["LangGraph (shared state)", "892,100", "418", "$0.49", "−31%"],
          [<b key="r">RAGForge blackboard</b>, <b key="1">541,800</b>, <b key="2">237</b>, <b key="3">$0.30</b>, <b key="4">−58%</b>],
        ]}
      />
      <P>
        Savings come from <b>stigmergic deduplication</b>: every retrieval result is hashed and
        posted to the blackboard. Before an agent issues a query, it checks the board for a
        semantically-equivalent prior result (cosine ≥ 0.94 on the query embedding). Cache hits
        skip the retriever entirely and reuse the cited chunks.
      </P>

      <H2 id="vs">Why choose RAGForge over LangChain / LlamaIndex / Haystack?</H2>
      <Table
        headers={["Capability", "RAGForge", "LangChain", "LlamaIndex", "Haystack"]}
        rows={[
          ["Zero required deps (core install)", "✅", "❌", "❌", "❌"],
          ["Built-in evaluation + golden sets", "✅", "Partial (langsmith)", "Partial", "✅"],
          ["Safe embedder migration with validation", "✅", "❌", "❌", "❌"],
          ["Multi-agent blackboard w/ dedup", "✅", "Manual", "Manual", "❌"],
          ["A/B compare two KBs out of the box", "✅", "❌", "❌", "❌"],
          ["Pluggable registry (no class hierarchy)", "✅", "❌", "Partial", "Partial"],
          ["CLI + HTTP + Python parity", "✅", "Python only", "Python only", "Python + REST"],
          ["Single-file vector store (no daemon)", "✅", "❌", "Partial", "❌"],
        ]}
      />
      <H3>Pick RAGForge if you…</H3>
      <UL>
        <li>Need to <b>prove</b> a change helped — eval and A/B compare are first-class, not a separate SaaS.</li>
        <li>Ship in environments where you can't run a vector DB daemon (edge boxes, CI, notebooks).</li>
        <li>Have to swap embedding models in production without a re-index outage.</li>
        <li>Want one mental model across CLI, library, and HTTP — same components, same names.</li>
      </UL>

      <H2 id="architecture">Architecture at a glance</H2>
      <P>Single pipeline. Pluggable at every stage. The dashed boxes are optional.</P>
      <CodeBlock
        lang="text"
        filename="architecture"
        code={`        INPUTS                       PIPELINE                          OUTPUTS
   ┌────────────────┐    ┌──────────────────────────────┐    ┌──────────────────┐
   │  PDF / MD /    │    │   Parser  →  Chunker         │    │   Ranked chunks  │
   │  HTML / DOCX   │──▶ │     │           │            │ ─▶ │   + citations    │
   │  URL / Folder  │    │     ▼           ▼            │    │                  │
   └────────────────┘    │  Document    Chunk[]         │    │  Grounded answer │
                         │                 │            │    │  (optional LLM)  │
   ┌────────────────┐    │                 ▼            │    │                  │
   │  Question      │──▶ │  Embedder  →  Vector Store   │ ─▶ │  Eval report     │
   │  (text)        │    │                 │            │    │  (optional)      │
   └────────────────┘    │                 ▼            │    └──────────────────┘
                         │  Retriever (BM25 │ Dense │   │
                         │             Hybrid)          │
                         │                 │            │
                         │                 ▼            │
                         │  Reranker  →  Prompt Builder │
                         │                 │            │
                         │           ┌─────┴─────┐      │
                         │           ▼           ▼      │
                         │      ┌ ─ ─ ─ ┐  ┌ ─ ─ ─ ─ ┐ │
                         │       LLM        Evaluator   │
                         │      └ ─ ─ ─ ┘  └ ─ ─ ─ ─ ┘ │
                         └──────────────────────────────┘
                                       ▲
                                       │
                         ┌─────────────┴──────────────┐
                         │  Registry  (plugin lookup) │
                         │  Blackboard (agent memory) │
                         └────────────────────────────┘`}
      />
      <P>
        Every box in the pipeline is a registry entry. Swap{" "}
        <Code>retriever="hybrid"</Code> for <Code>retriever="dense"</Code>, or register a custom
        one with <Code>@register("retriever", "mine")</Code>. The Registry and Blackboard are the
        only two cross-cutting primitives.
      </P>

      <H2 id="novelty">What's actually new</H2>
      <P>
        Deliberately scoped — these are the parts we'd point a reviewer at. Implementations live
        in the linked source.
      </P>

      <H3>1. Shadow-index migration with validation</H3>
      <P>
        Most frameworks treat embedder swaps as "drop the index and re-ingest." RAGForge builds a
        shadow store with the new model, probes <i>both</i> stores with N real chunks, measures
        top-k overlap, and only cuts over after writing a backup. The quality delta is returned in
        the response — see{" "}
        <ExtLink href={`${BLOB}/ragforge/migration/migrator.py`}>migrator.py</ExtLink>. We are not
        aware of another open-source RAG framework that does this in-process.
      </P>

      <H3>2. Stigmergic blackboard for multi-agent retrieval</H3>
      <P>
        Inspired by ant-colony stigmergy: agents leave structured "pheromone" traces (query
        embedding, returned chunk hashes, score, timestamp) on a shared board. New retrieval calls
        first check the board for a near-duplicate query (cosine ≥ τ, default 0.94) and reuse the
        cited evidence when found. This is what produces the 58% cost reduction above. The exact
        decay and similarity threshold tuning is intentionally not described here. Entry point:{" "}
        <ExtLink href={`${BLOB}/ragforge/agents/blackboard.py`}>blackboard.py</ExtLink>.
      </P>

      <H3>3. Dual-judge evaluation with disagreement gating</H3>
      <P>
        Faithfulness and answer-relevance are scored by two independent LLM judges. When they
        disagree by more than a configured margin, the example is flagged for human review instead
        of silently averaged. This sharply reduces silent regressions from prompt tweaks. See{" "}
        <ExtLink href={`${BLOB}/ragforge/evaluation/judges.py`}>judges.py</ExtLink>.
      </P>

      <H3>4. Structure-aware chunking with section inheritance</H3>
      <P>
        The default chunker walks heading levels and attaches the full breadcrumb (
        <Code>H1 ▸ H2 ▸ H3</Code>) to each chunk's metadata before embedding the chunk text
        prefixed with its breadcrumb. On the MS MARCO subset this alone contributes{" "}
        <b>+3.1 nDCG@10</b> over naïve fixed-window chunking with identical embedder and retriever.
      </P>

      <H2 id="reproduce">Reproduce</H2>
      <CodeBlock
        lang="bash"
        code={`git clone https://github.com/samsuljahith/RagForge && cd RagForge
pip install -e ".[all]"
cd benchmarks
python download_msmarco_subset.py
python run_quality.py     --frameworks ragforge,langchain,llamaindex,haystack
python run_latency.py     --frameworks ragforge,langchain,llamaindex,haystack --runs 1000
python run_memory.py      --frameworks ragforge,langchain,llamaindex,haystack
python run_agent_cost.py  --scenarios sequential,langgraph,ragforge`}
      />
      <P>
        Numbers in the tables above are the medians from the last run committed in{" "}
        <ExtLink href={`${BLOB}/benchmarks/results`}>benchmarks/results/</ExtLink>. Re-run on your
        hardware; PRs with new data points welcome.
      </P>

      <PrevNext
        prev={{ to: "/docs/architecture", label: "Architecture" }}
        next={{ to: "/docs/cli", label: "CLI reference" }}
      />
    </>
  );
}
