import { createFileRoute } from "@tanstack/react-router";
import { BLOB, Code, CodeBlock, ExtLink, H1, H2, Lead, P, PrevNext, UL } from "@/components/docs/primitives";

export const Route = createFileRoute("/docs/coordination")({
  head: () => ({
    meta: [
      { title: "Multi-agent coordination — RAGForge" },
      { name: "description", content: "How RAGForge's blackboard-based multi-agent coordination works, with a working 3-agent example." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <H1>Multi-agent coordination</H1>
      <Lead>
        Agents don't message each other directly — they share state on a Blackboard. Reads are
        targeted, writes are logged, and the loop itself burns no LLM tokens. Source:{" "}
        <ExtLink href={`${BLOB}/ragforge/coordination`}>ragforge/coordination/</ExtLink>.
      </Lead>

      <H2 id="how">How it works</H2>
      <P>
        The system uses <b>stigmergy</b>: each agent reads the board, decides if it should fire via
        a <Code>trigger_fn(board) → bool</Code>, and writes results back. The{" "}
        <Code>Orchestrator</Code> runs a deterministic loop:
      </P>
      <UL>
        <li>Check each agent's trigger function.</li>
        <li>Fire all eligible agents in sequence.</li>
        <li>Repeat until <Code>goal(board)</Code> is met, quiescence, or <Code>max_steps</Code>.</li>
      </UL>
      <P>
        Each entry carries <Code>key</Code>, <Code>value</Code>, <Code>author</Code>,{" "}
        <Code>timestamp</Code>, <Code>tags</Code>, and an auto-incrementing <Code>version</Code> for
        conflict detection. The persistent backend is SQLite (WAL mode).
      </P>

      <H2 id="example">Working example — 3 agents</H2>
      <P>
        From{" "}
        <ExtLink href={`${BLOB}/examples/multi_agent_coordination.py`}>
          examples/multi_agent_coordination.py
        </ExtLink>
        .
      </P>
      <CodeBlock lang="python" code={`from ragforge.coordination.blackboard import InMemoryBlackboard
from ragforge.coordination.agent import Agent, Orchestrator, AgentResult

board = InMemoryBlackboard("research-task")
board.write("question", "What is RAGForge's approach to coordination?", author="user")

def researcher_trigger(board):
    return board.has_key("question") and not board.has_key("findings")

def researcher_action(board, agent_id):
    question = board.read("question")
    findings = "RAGForge uses blackboard-based stigmergy..."
    board.write("findings", findings, author=agent_id,
                tags={"confidence": 0.85, "status": "pending_review"})
    return AgentResult(agent_id=agent_id, entries_read=["question"],
                       entries_written=["findings"], tokens_used=120)

def critic_trigger(board):
    entries = board.read_by_tag("status", lambda v: v == "pending_review")
    return len(entries) > 0 and not board.has_key("review")

def critic_action(board, agent_id):
    findings = board.read("findings")
    if findings.tags.get("confidence", 0) > 0.7:
        board.write("review", "Approved.", author=agent_id,
                    tags={"status": "approved"})
    return AgentResult(agent_id=agent_id, entries_read=["findings"],
                       entries_written=["review"], tokens_used=60)

def writer_trigger(board):
    review = board.read("review")
    return review and review.tags.get("status") == "approved" and not board.has_key("final_answer")

def writer_action(board, agent_id):
    board.write("final_answer", "RAGForge uses stigmergy...", author=agent_id,
                tags={"status": "complete"})
    return AgentResult(agent_id=agent_id, entries_read=["findings", "review"],
                       entries_written=["final_answer"], tokens_used=180)

agents = [
    Agent("researcher", researcher_trigger, researcher_action),
    Agent("critic",     critic_trigger,     critic_action),
    Agent("writer",     writer_trigger,     writer_action),
]

goal = lambda board: board.has_key("final_answer")
orch = Orchestrator(board, agents, goal=goal, max_steps=10)
result = orch.run()

print(f"Steps: {len(result.steps)}  Tokens: {result.total_tokens}  Cost: \${result.total_cost_usd:.4f}")
print(board.read("final_answer").value)`} />

      <H2 id="cli">Run from the CLI</H2>
      <CodeBlock lang="bash" code={`ragforge agents run config.py --max-steps 20 --persist
ragforge agents benchmark config.py
ragforge agents board research-task`} />

      <H2 id="api">HTTP API</H2>
      <P>See <a className="text-primary underline underline-offset-4" href="/docs/api#coordination">Coordination endpoints</a> for the full REST surface.</P>

      <PrevNext
        prev={{ to: "/docs/evaluation", label: "Evaluation" }}
        next={{ to: "/docs/migration", label: "Migration" }}
      />
    </>
  );
}
