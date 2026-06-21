import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, Lead, P, PrevNext } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/migration")({
  head: () => ({
    meta: [
      { title: "Migration — RAGForge" },
      { name: "description", content: "Safely swap embedding models with shadow-index migration, validation, and atomic cutover." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Migration</H1>
      <Lead>
        Don't migrate blind. RAGForge shadow-indexes a new embedding model, validates quality
        overlap against the old one on your real chunks, backs up the old index, and only then
        cuts over. Source:{" "}
        <ExtLink href={`${BLOB}/ragforge/migration/migrator.py`}>migrator.py</ExtLink>.
      </Lead>

      <H2 id="process">Step by step</H2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-foreground/85 marker:text-primary">
        <li><b>Load existing KB</b> — read chunks from <Code>~/.ragforge/knowledge_bases/&lt;name&gt;/vectors.json</Code>.</li>
        <li><b>Re-embed</b> with the new model — <Code>new_embedder.encode(texts)</Code> on every chunk.</li>
        <li><b>Build shadow index</b> — new <Code>InMemoryStore</Code> with the new vectors. Old store untouched.</li>
        <li><b>Validate</b> (if <Code>validate=True</Code>) — pick the first chunk's text as a probe, embed with both old and new model, compare top-3 results for overlap. <Code>quality_after = overlap_ratio</Code>.</li>
        <li><b>Backup old store</b> — copy <Code>vectors.json</Code> to <Code>vectors_backup.json</Code>.</li>
        <li><b>Atomic cutover</b> — save the new store over <Code>vectors.json</Code>.</li>
        <li><b>Update metadata</b> — write <Code>embedder_name</Code>, <Code>migrated_from</Code>, and <Code>embedder_dim</Code> to <Code>meta.json</Code>.</li>
      </ol>

      <H2 id="python">Python</H2>
      <CodeBlock lang="python" code={`from ragforge.migration import migrate_knowledge_base

result = migrate_knowledge_base(
    knowledge="my-kb",
    from_model="default",
    to_model="openai",
    validate=True,
)
print(result)
# {'knowledge': 'my-kb', 'from_model': 'default', 'to_model': 'openai',
#  'status': 'migrated', 'quality_before': 1.0, 'quality_after': 0.9667,
#  'num_chunks_migrated': 87}`} />

      <H2 id="api">HTTP API</H2>
      <CodeBlock lang="bash" code={`curl -X POST http://localhost:8000/migrate \\
  -H "Content-Type: application/json" \\
  -d '{
    "knowledge":      "my-kb",
    "from_model":     "default",
    "to_model":       "openai",
    "run_validation": true
  }'`} />
      <P>
        The response includes <Code>quality_before</Code>, <Code>quality_after</Code>, and{" "}
        <Code>num_chunks_migrated</Code>. The previous index stays on disk as{" "}
        <Code>vectors_backup.json</Code> so you can roll back manually if needed.
      </P>

      <PrevNext prev={{ to: "/docs/coordination", label: "Multi-agent" }} />
    </>
  );
}
