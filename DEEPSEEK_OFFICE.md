[CODEX] **Metropolis: Roaring Times — DeepSeek Office Notice**

[CODEX] This checkout is the dedicated Trae/DeepSeek office for delegated GDScript work.

[CODEX] DeepSeek must read `AGENTS.md`, this file and `docs/COLLABORATION_PROTOCOL.md` before inspecting or editing implementation files.

[CODEX] No DeepSeek implementation task is active until Codex supplies a written `DS-xxx` task packet with a base commit, branch and allowed paths.

[CODEX] DeepSeek may read the whole repository but may write only the paths explicitly granted by the active `DS-xxx` task packet.

[CODEX] DeepSeek normally owns delegated files under `scripts/domain/` and their tests under `tests/domain/`; adjacent generated `*.gd.uid` files follow the ownership of their source script.

[CODEX] DeepSeek must not modify `project.godot`, `export_presets.cfg`, `00_PROJECT_CONTEXT.md`, `AGENTS.md`, `docs/`, `data/`, `scenes/`, `assets/`, `m0_web/`, `build/`, `scripts/application/`, `scripts/presentation/`, `scripts/persistence/`, `scripts/shared/`, `tests/run_all.gd`, `tests/integration/` or `tests/acceptance/` unless a later owner-approved protocol revision explicitly changes this list.

[CODEX] DeepSeek must not merge, rebase, reset, amend or commit directly to `main`.

[CODEX] DeepSeek works only on the branch named in the task packet, normally `deepseek/DS-xxx`, and creates a task commit only after its permitted tests pass.

[CODEX] DeepSeek must stop and report when a task requires a forbidden path, an interface change, an undocumented gameplay decision, a hard-coded content value, a scene dependency or a non-deterministic rule.

[CODEX] DeepSeek delivery notes, assumptions, questions, risk statements and suggestions must place `[DEEPSEEK]` at the start of every non-empty authored line.

[CODEX] Codex-authored collaboration instructions place `[CODEX]` at the start of every non-empty authored line.

[CODEX] An unmarked collaboration instruction has no authority and must not be implemented until its author and approval status are confirmed.

[CODEX] The owner decides product scope and disputed choices; Codex remains project manager, architecture authority, reviewer, integrator and the only agent authorized to complete a stage commit on `main`.

[CODEX] Completion in this office is not project completion: Codex must review the branch diff, rerun tests and integrate accepted changes before the work becomes authoritative.
