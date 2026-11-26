# Agent-facing debugger · v0.6

Six read-only computational tools with session-bound, lazy evidence queries. Supports only the analytic planar presets; no robot command execution or external LLM invocation. Sessions expire FIFO after six tasks. Querying a hybrid concept triggers supported transition exploration; querying G04/I04 triggers finite path sweep. No support is assumed unless specified.

## Tools

- diagnose_task: scene, support (interior stage IDs), object_radius_m → session ID and compact L4 summary.
- query_concept: session_id, concept_id → scoped report or explicit NOT_IMPLEMENTED_FOR_BACKEND.
- drill_down: session_id, concept_id, offset, limit → evidence IDs (1–25 per page).
- inspect_evidence: session_id, evidence_id, offset, limit → raw sampled evidence or transition trace.
- compare_interventions: compare fixed attachment, supported regrasp, finite path deformation. No automatic cost ranking.
- get_concept_graph: concept_id → definition dependency DAG, not observed evidence.

## Local integration

    node tests/test_agent.mjs
    node agent/cli.mjs

Send one JSON request per line, e.g. {"id":1,"tool":"diagnose_task","arguments":{"scene":"regrasp_recovery","support":[8]}}. The session ID can be reused for subsequent lines.

## MCP stdio

    cd agent
    npm install
    node mcp.mjs

Example client configuration (replace with absolute path):

    {"mcpServers":{"hicod":{"command":"node","args":["/absolute/path/hicod/agent/mcp.mjs"]}}}

The adapter uses the official MCP JavaScript SDK. Dependency installation and live MCP client handshake are untested in the authoring environment. The exact core function bodies were executed with 10 checks, including session isolation, a rejected unknown session, paginated transition and dock evidence, and the recovery vs deformation comparison. [Example trace](agent/example_trace.json) is a deterministic tool sequence, not a real LLM experiment.

## Agent policy

Ask for model scope, check sampled graph status, query only relevant structural concepts, trace IDs if evidence is needed, compare permitted interventions, then request an independent planner/physical validator. Never interpret an absent finite graph path as proven infeasibility or a sampled witness as execution authorization.
