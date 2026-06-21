import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, Lead, P, PrevNext, Table } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation — RAGForge" },
      { name: "description", content: "Golden datasets, retrieval and LLM-judge metrics, and A/B comparison in RAGForge." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Evaluation</H1>
      <Lead>
        Measure retrieval quality on your own data, prove changes help, and compare two knowledge
        bases on the same golden set. Source:{" "}
        <ExtLink href={`${BLOB}/ragforge/evaluation`}>ragforge/evaluation/</ExtLink>.
      </Lead>

      <H2 id="metrics">Metrics</H2>
      <Table
        headers={["Metric", "What it measures"]}
        rows={[
          [<Code key="1">hit_rate</Code>, "Did any relevant chunk appear in top-k? 1.0 or 0.0."],
          [<Code key="2">precision_at_k</Code>, "Fraction of retrieved chunks that were relevant."],
          [<Code key="3">recall_at_k</Code>, "Fraction of all relevant chunks retrieved."],
          [<Code key="4">mrr</Code>, "Mean Reciprocal Rank — how high up was the first relevant chunk?"],
          [<Code key="5">faithfulness</Code>, "LLM-judge: is the answer grounded in context? 0–1."],
          [<Code key="6">answer_relevance</Code>, "LLM-judge: does the answer address the question? 0–1."],
        ]}
      />

      <H2 id="golden">Golden dataset format</H2>
      <P>JSON (or CSV with the same column names). Only <Code>question</Code> is required.</P>
      <CodeBlock lang="json" filename="golden.json" code={`[
  {
    "question":           "What is the refund window for electronics?",
    "expected_answer":    "14 days",
    "relevant_chunk_ids": ["a1b2c3d4", "b2c3d4e5"],
    "relevant_sources":   ["refund_policy.md"],
    "notes":              "From the Electronics section"
  },
  {
    "question": "Is free shipping available?"
  }
]`} />

      <H2 id="cli">Run from the CLI</H2>
      <CodeBlock lang="bash" code={`ragforge eval run my-kb golden.json
ragforge eval run my-kb golden.json --metrics hit_rate,mrr --mode hybrid -k 5
ragforge eval run my-kb golden.json --generate --llm ollama  # include judge metrics
ragforge eval compare my-kb-v1 my-kb-v2 golden.json`} />

      <H2 id="python">Run from Python</H2>
      <CodeBlock lang="python" code={`from ragforge.pipeline import KnowledgeBase
from ragforge.evaluation import GoldenDataset, Evaluator, RETRIEVAL_METRICS

kb = KnowledgeBase.load("my-kb")
golden = GoldenDataset.load("golden.json")

evaluator = Evaluator(kb)
report = evaluator.run(golden, metrics=RETRIEVAL_METRICS, top_k=5, mode="hybrid")
report.print_table()

kb_v2 = KnowledgeBase.load("my-kb-v2")
comparison = Evaluator.compare(kb, kb_v2, golden, metrics=RETRIEVAL_METRICS)
Evaluator.print_comparison(comparison)`} />

      <H2 id="bootstrap">Bootstrap a draft golden set</H2>
      <P>Generate a draft from an existing KB using an LLM. Output is marked <Code>DRAFT</Code> — always review before using as ground truth.</P>
      <CodeBlock lang="bash" code={`ragforge eval bootstrap my-kb --n 20 --llm ollama --out draft_golden.json`} />

      <PrevNext
        prev={{ to: "/docs/modules", label: "Python modules" }}
        next={{ to: "/docs/coordination", label: "Multi-agent" }}
      />
    </>
  );
}
