import { createFileRoute } from "@tanstack/react-router";
import { BLOB, CodeBlock, ExtLink, H1, H2, Lead, P, PrevNext, UL } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/quickstart")({
  head: () => ({
    meta: [
      { title: "Quickstart — RAGForge" },
      { name: "description", content: "Install RAGForge and run your first query — via CLI, Python, or HTTP — in under five minutes." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Quickstart</H1>
      <Lead>
        Install RAGForge, build a knowledge base, and run a query — three ways.
        Code is sourced from <ExtLink href={`${BLOB}/README.md`}>README.md</ExtLink>.
      </Lead>

      <H2 id="install">Install</H2>
      <P>RAGForge requires Python 3.9+. The core install has no required dependencies.</P>
      <CodeBlock
        lang="bash"
        code={`pip install ragforge             # core (zero dependencies)
pip install ragforge[api]        # add HTTP API server
pip install ragforge[pdf]        # PDF support (pypdf)
pip install ragforge[pipeline]   # sentence-transformers embeddings + reranking
pip install ragforge[openai]     # OpenAI embeddings + LLM
pip install ragforge[anthropic]  # Anthropic LLM
pip install ragforge[docling]    # Docling backend (best for complex docs)
pip install ragforge[ui]         # local web dashboard
pip install ragforge[all]        # everything`}
      />

      <H2 id="cli">1. CLI in 30 seconds</H2>
      <CodeBlock
        lang="bash"
        code={`ragforge info                                  # see registered components
ragforge knowledge build my-kb ./docs/         # build a knowledge base
ragforge query my-kb "How do refunds work?"    # query it
ragforge query my-kb "refunds?" --generate --llm ollama  # with grounded answer`}
      />
      <P>Full reference: see the <a className="text-primary underline underline-offset-4" href="/docs/cli">CLI page</a>.</P>

      <H2 id="python">2. Python library</H2>
      <CodeBlock
        filename="python"
        lang="python"
        code={`import ragforge as rf

doc = rf.parse_file("notes.md")
chunks = rf.chunk_document(doc, strategy="structure")

for c in chunks:
    print(f"[{c.metadata.get('section')}] ~{c.token_count} tokens")`}
      />
      <P>Build a knowledge base and query it:</P>
      <CodeBlock
        filename="python"
        lang="python"
        code={`from ragforge.pipeline import build_knowledge_base, query_knowledge_base

build_knowledge_base(name="my-kb", sources=["./docs/"])

result = query_knowledge_base(knowledge="my-kb", question="Refund policy?")
for chunk in result["chunks"]:
    print(f"  [{chunk['score']:.3f}] {chunk['text'][:80]}")`}
      />
      <P>Or use the object-oriented <code>KnowledgeBase</code> class:</P>
      <CodeBlock
        filename="python"
        lang="python"
        code={`from ragforge.pipeline import KnowledgeBase

kb = KnowledgeBase.build(
    name="my-kb",
    sources=["docs/", "faq.md"],
    embedder="default",
    chunk_strategy="structure",
)

for chunk, score in kb.query("How do refunds work?", top_k=5, mode="hybrid"):
    print(f"  [{score:.4f}] {chunk.text[:80]}...")`}
      />

      <H2 id="http">3. HTTP API</H2>
      <CodeBlock
        lang="bash"
        code={`pip install ragforge[api]
ragforge serve
# Interactive docs at http://localhost:8000/docs`}
      />
      <P>Then call it from any language. Example: curl with an LLM answer.</P>
      <CodeBlock
        lang="bash"
        code={`curl -X POST http://localhost:8000/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "knowledge": "my-kb",
    "question":  "How do refunds work?",
    "generate":  true,
    "llm":       "ollama"
  }'`}
      />

      <H2 id="docker">Docker</H2>
      <CodeBlock
        lang="bash"
        code={`docker build -t ragforge .
docker run -p 8000:8000 ragforge`}
      />

      <H2 id="next">What's next</H2>
      <UL>
        <li>Browse the <a className="text-primary underline underline-offset-4" href="/docs/api">HTTP API reference</a> for every endpoint.</li>
        <li>Read <a className="text-primary underline underline-offset-4" href="/docs/architecture">Architecture</a> to see how the pieces fit together.</li>
        <li>Set up <a className="text-primary underline underline-offset-4" href="/docs/evaluation">Evaluation</a> to measure changes objectively.</li>
      </UL>

      <PrevNext
        prev={{ to: "/docs", label: "Overview" }}
        next={{ to: "/docs/architecture", label: "Architecture" }}
      />
    </>
  );
}
