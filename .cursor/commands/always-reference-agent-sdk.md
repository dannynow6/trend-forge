# Always Reference OpenAI Agents SDK (TypeScript)

## Purpose

Ensure that for any work involving agents in our app/project, the AI uses the **OpenAI Agents SDK (TypeScript)** documentation as a source of truth. This includes design, implementation, behavior, naming, configuration, tooling, and best practices.

## When to Apply

This command should be applied in any of the following cases:

- Creating new agents (or agent-like components)
- Adding or modifying tools or handoffs in agents
- Defining guardrails, context management, tracing, or similar features related to agents
- Refactoring existing agent code
- Reviewing pull requests or code involving agents

## Reference Docs

Always refer to the documentation here:  
[OpenAI Agents SDK (TypeScript)](https://openai.github.io/openai-agents-js/) :contentReference[oaicite:0]{index=0}

From that documentation, especially consult sections such as:

- Quickstart & Examples :contentReference[oaicite:1]{index=1}
- Agents / Running Agents / Tools / Handoffs :contentReference[oaicite:2]{index=2}
- Guardrails, Context Management, ModelBehavior, Trace / Tracing :contentReference[oaicite:3]{index=3}
- API reference: types, interfaces, classes relevant to agents :contentReference[oaicite:4]{index=4}

## Guidelines

1. **Design & Initialization**

   - Use classes / interfaces from the SDK when defining new agents or extending functionality.
   - Follow naming, option patterns, default values as per SDK docs.

2. **Tools / Handoffs / Guardrails**

   - When using tools, ensure they are set up as the SDK expects (e.g. function tools with correct schema / validation).
   - Handoffs between agents should align to SDK’s handoff patterns.
   - Guardrails should follow the types, behavior, and error handling paradigms in SDK.

3. **Tracing, Context & State Management**

   - Use tracing, logs, and context tools provided by the SDK rather than inventing ad-hoc versions.
   - Context management (how information is passed between turns or handoffs) should mirror SDK approach.

4. **Typing & API contracts**

   - Use the TypeScript types/interfaces from the SDK (e.g. `Agent`, `AgentConfiguration`, `Tool`, etc.) wherever possible.
   - Ensure function signatures and return types match what the SDK expects.

5. **Testing and Validation**

   - When writing tests for agents or tools, cover use cases shown in SDK examples.
   - Validate behavior against SDK behavior (e.g. how errors are handled, how agent loops terminate, etc.).

6. **Updates / Versioning**
   - Periodically check the SDK docs for updates and breaking changes.
   - Ensure dependencies (versions of `@openai/agents`) are aligned with the docs used.

## Checklist

- [ ] References to the Agents SDK docs are included in the design or implementation plan
- [ ] Agent code uses classes, types, or patterns defined in the SDK
- [ ] Tools / handoffs / guardrails implemented according to SDK behavior
- [ ] Tests reflect example edge cases and usage patterns from SDK docs
- [ ] Trace / context management follows SDK’s features
- [ ] Code review includes verifying alignment with SDK API

## Example Usage

> **Task**: Build a new agent to handle parsing user queries and delegating to sub-agents for search + summarization.

- Use `Agent` from `@openai/agents` to define the high-level agent.
- Use `run(...)` or the agent loop pattern from Quickstart.
- Define tools as function tools (or tool classes) using SDK validation and schema.
- If delegating to sub-agents, implement handoffs just like the SDK handoff example.
- Use tracing APIs to trace tool calls, agent decisions, etc.
- Write tests comparing actual behavior to what the SDK docs show for similar agents.

---
