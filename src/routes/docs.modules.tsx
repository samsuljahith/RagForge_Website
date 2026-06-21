import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, H3, Lead, P, PrevNext, Table } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/modules")({
  head: () => ({
    meta: [
      { title: "Python modules — RAGForge" },
      { name: "description", content: "Public classes and functions across ragforge.core, parsing, chunking, pipeline, evaluation, quantization, migration, coordination, tracing." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Python modules</H1>
      <Lead>
        Public surface area of the Python library, sourced from{" "}
        <ExtLink href={`${BLOB}/ragforge`}>ragforge/</ExtLink>.
      </Lead>

      <H2 id="top">ragforge (top-level)</H2>
      <P>Re-exports for the most common workflow.</P>
      <Table
        headers={["Name", "Kind", "Description"]}
        rows={[
          [<Code key="1">parse_file(path)</Code>, "function", "Parse any supported file into a Document."],
          [<Code key="2">chunk_document(doc, strategy)</Code>, "function", "Split a Document into a list of Chunk."],
          [<Code key="3">Document</Code>, "class", "Parsed document: text, source, doc_type, metadata, id."],
          [<Code key="4">Chunk</Code>, "class", "One chunk: text, doc_id, index, metadata, id."],
          [<Code key="5">available(kind)</Code>, "function", "List registered names for a plugin kind."],
        ]}
      />

      <H2 id="core">ragforge.core</H2>
      <H3>core.models — <ExtLink href={`${BLOB}/ragforge/core/models.py`}>models.py</ExtLink></H3>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">Document</Code>, "@dataclass — text, source, doc_type, metadata, id; .token_count property."],
          [<Code key="2">Chunk</Code>, "@dataclass — text, doc_id, index, metadata, id; .token_count property."],
          [<Code key="3">estimate_tokens(text)</Code>, "~4 chars/token approximation, no tokenizer dependency."],
        ]}
      />

      <H3>core.registry — <ExtLink href={`${BLOB}/ragforge/core/registry.py`}>registry.py</ExtLink></H3>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">@register(kind, name)</Code>, "Decorator to register a class under a (kind, name) pair."],
          [<Code key="2">get(kind, name)</Code>, "Look up a registered class."],
          [<Code key="3">available(kind)</Code>, "List all registered names for a kind."],
          [<Code key="4">registered_info()</Code>, "Full registry dump across all kinds."],
        ]}
      />
      <CodeBlock
        lang="python"
        code={`from ragforge.core.registry import register, get, available

@register("chunker", "fixed")
class FixedChunker(...):
    ...

chunker_cls = get("chunker", "fixed")
print(available("chunker"))  # ['fixed', 'structure', ...]`}
      />

      <H2 id="parsing">ragforge.parsing</H2>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">parse_file(path, parser=None)</Code>, "Auto-detect by extension and parse; optional override."],
          [<Code key="2">TextParser</Code>, "Registered as 'text' — handles .txt and .md."],
          [<Code key="3">HtmlParser</Code>, "Registered as 'html' — strips HTML tags."],
          [<Code key="4">PdfParser</Code>, "Registered as 'pdf' — requires [pdf] extra (pypdf)."],
          [<Code key="5">DoclingParser</Code>, "Registered as 'docling' — for complex layouts. Requires [docling]."],
        ]}
      />

      <H2 id="chunking">ragforge.chunking</H2>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">chunk_document(doc, strategy, **kw)</Code>, "Dispatch to strategy; returns list[Chunk]."],
          [<Code key="2">FixedChunker</Code>, "'fixed' — sliding window by token count (chunk_tokens, overlap)."],
          [<Code key="3">StructureChunker</Code>, "'structure' — split on Markdown headings, respecting max_tokens."],
          [<Code key="4">DoclingChunker</Code>, "'docling' — Docling-aware; keeps tables and code blocks intact."],
        ]}
      />

      <H2 id="pipeline">ragforge.pipeline</H2>
      <H3>KnowledgeBase — <ExtLink href={`${BLOB}/ragforge/pipeline/knowledge.py`}>knowledge.py</ExtLink></H3>
      <Table
        headers={["Method", "Description"]}
        rows={[
          [<Code key="1">KnowledgeBase.build(...)</Code>, "classmethod — parse, chunk, embed, persist a new KB."],
          [<Code key="2">KnowledgeBase.load(name)</Code>, "classmethod — load a previously built KB."],
          [<Code key="3">kb.query(question, top_k, mode, rerank)</Code>, "list[(Chunk, score)] — dense/BM25/hybrid retrieval."],
        ]}
      />
      <H3>Module-level functions</H3>
      <Table
        headers={["Function", "Description"]}
        rows={[
          [<Code key="1">build_knowledge_base(name, sources, ...)</Code>, "Convenience wrapper around KnowledgeBase.build()."],
          [<Code key="2">query_knowledge_base(knowledge, question, ...)</Code>, "Wrapper around KnowledgeBase.load().query() + optional generation."],
        ]}
      />
      <H3>Sub-modules</H3>
      <Table
        headers={["Module", "Description"]}
        rows={[
          [<Code key="1">pipeline.embeddings</Code>, "Embedder ABC; DefaultEmbedder (hash-based, zero deps); SentenceTransformerEmbedder; OpenAIEmbedder."],
          [<Code key="2">pipeline.store</Code>, "InMemoryStore — vector store with .add(), .search(), .save(), .load()."],
          [<Code key="3">pipeline.bm25</Code>, "BM25Index — keyword index with RRF fusion."],
          [<Code key="4">pipeline.retriever</Code>, "Retriever — dense/BM25/hybrid with optional cross-encoder reranking."],
          [<Code key="5">pipeline.generation</Code>, "LLMProvider ABC; OpenAI/Anthropic/Ollama; grounded answers with refusal."],
        ]}
      />

      <H2 id="evaluation">ragforge.evaluation</H2>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">GoldenItem</Code>, "Dataclass: question, expected_answer, relevant_chunk_ids, relevant_sources, notes."],
          [<Code key="2">GoldenDataset</Code>, ".load(path) (JSON or CSV), .save(path)."],
          [<Code key="3">Evaluator(kb).run(golden, metrics, ...)</Code>, "Run evaluation → EvalReport."],
          [<Code key="4">Evaluator.compare(a, b, golden, ...)</Code>, "A/B comparison with delta table."],
          [<Code key="5">generate_golden_draft(...)</Code>, "LLM-bootstrapped draft golden dataset (review required)."],
          [<Code key="6">RETRIEVAL_METRICS</Code>, "['hit_rate', 'precision_at_k', 'recall_at_k', 'mrr']."],
        ]}
      />

      <H2 id="quantization">ragforge.quantization</H2>
      <P>
        See{" "}
        <ExtLink href={`${BLOB}/ragforge/quantization/quantizer.py`}>quantizer.py</ExtLink>.
      </P>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">quantize_and_compare(target, knowledge, options)</Code>, "Quantize an embedding model and return a before/after CostQualityReport."],
        ]}
      />

      <H2 id="migration">ragforge.migration</H2>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">migrate_knowledge_base(knowledge, from_model, to_model, validate, options)</Code>, "Full shadow-index migration."],
        ]}
      />

      <H2 id="coordination">ragforge.coordination</H2>
      <H3>Blackboard</H3>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">BlackboardEntry</Code>, "key, value, author, timestamp, tags, version."],
          [<Code key="2">Blackboard(name)</Code>, "SQLite-backed (WAL mode), thread-safe, persistent."],
          [<Code key="3">InMemoryBlackboard(name)</Code>, "In-memory variant with the same API."],
          [<Code key="4">board.write/read/read_all/read_by_tag</Code>, "Read/write entries with optional tag filters."],
        ]}
      />
      <H3>Agent + Orchestrator</H3>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">Agent(id, trigger_fn, action_fn)</Code>, "Agent with trigger condition and action."],
          [<Code key="2">Orchestrator(board, agents, goal, max_steps)</Code>, "Loop until goal met or quiescence."],
          [<Code key="3">orchestrator.run()</Code>, "Returns OrchestrationResult (steps, tokens, cost, reason)."],
          [<Code key="4">run_benchmark(task)</Code>, "Blackboard vs direct-messaging cost comparison."],
        ]}
      />

      <H2 id="tracing">ragforge.tracing</H2>
      <Table
        headers={["Name", "Description"]}
        rows={[
          [<Code key="1">Tracer()</Code>, "Pipeline tracer backed by SQLite at ~/.ragforge/traces.db."],
          [<Code key="2">tracer.trace(query)</Code>, "Context manager — records start/end, persists on exit."],
          [<Code key="3">t.step(name, **data)</Code>, "Record a named pipeline step with arbitrary data."],
          [<Code key="4">TraceStore.list_traces / get_trace</Code>, "Query the trace store."],
        ]}
      />

      <PrevNext
        prev={{ to: "/docs/api", label: "HTTP API" }}
        next={{ to: "/docs/evaluation", label: "Evaluation" }}
      />
    </>
  );
}
