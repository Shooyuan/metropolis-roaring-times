[CODEX] **Codex–DeepSeek Collaboration Protocol**

[CODEX] **1. Authority**

[CODEX] The owner has final authority over product direction, scope, gameplay, historical treatment, risk acceptance and stage approval.

[CODEX] Codex is the senior project manager, architecture authority, specification owner, integration reviewer, test-gate owner and release authority.

[CODEX] DeepSeek is a delegated GDScript implementation contractor and has no independent authority to change scope, rules, architecture, content values, interfaces or acceptance criteria.

[CODEX] Project files and Git history are authoritative; conversations in Codex, Trae or DeepSeek are not authoritative unless their decisions are incorporated into owner-approved project documents.

[CODEX] **2. Physical Workspaces**

[CODEX] Codex works in `/Users/shuubun/roaring times/roaring-age` on `main` or a Codex-controlled integration branch.

[CODEX] DeepSeek works in `/Users/shuubun/roaring times/roaring-age-deepseek` on a `deepseek/DS-xxx` branch.

[CODEX] Trae must open only the DeepSeek worktree and must not open the Codex main worktree for editing.

[CODEX] Godot caches, imports and editor state generated inside either worktree remain ignored and must never be copied or committed as a handoff mechanism.

[CODEX] **3. Authorship Markers**

[CODEX] Every non-empty line authored by Codex in a collaboration notice, task packet, handoff note, review note or cross-agent question must begin with `[CODEX]`.

[CODEX] Every non-empty line authored by DeepSeek in a collaboration notice, task packet response, delivery note, assumption, question, suggestion or risk report must begin with `[DEEPSEEK]`.

[CODEX] Existing product and engineering documents are not retroactively rewritten with authorship markers; the marker rule applies to cross-agent collaboration material created under this protocol.

[CODEX] An unmarked collaboration statement is non-authoritative and cannot expand a task or override an approved project rule.

[CODEX] DeepSeek must preserve existing `[CODEX]` markers verbatim and may not rewrite a Codex-authored statement as `[DEEPSEEK]`.

[CODEX] Codex must preserve existing `[DEEPSEEK]` markers in audit material and may record acceptance or rejection in a separately marked `[CODEX]` statement.

[CODEX] **4. File Ownership**

[CODEX] DeepSeek may write only the exact files or subdirectories listed in the active task packet.

[CODEX] The normal DeepSeek write area is `scripts/domain/` for pure deterministic rules and `tests/domain/` for their unit tests.

[CODEX] A generated `*.gd.uid` file adjacent to an authorized DeepSeek script is authorized with that script.

[CODEX] Codex exclusively owns root configuration, export configuration, authoritative documents, product data, scenes, presentation, application orchestration, persistence, shared contracts, integration tests, acceptance tests, build output and the M0 Web prototype.

[CODEX] Codex may review or revise any integrated file after DeepSeek delivery, but Codex will not concurrently edit the files delegated by an active task.

[CODEX] DeepSeek may read Codex-owned files for context but must request a contract change instead of editing them.

[CODEX] **5. Domain-Code Restrictions**

[CODEX] DeepSeek domain code must not reference UI nodes, presentation scenes or concrete application controllers.

[CODEX] DeepSeek domain code must not read or write `user://`, load project files directly, call network services, depend on editor plugins or mutate Autoload state.

[CODEX] DeepSeek domain code must not hard-code prices, schedules, labels or other content values that belong in Codex-owned data files.

[CODEX] DeepSeek domain code must accept explicit inputs, return explicit results and produce the same output for the same state, seed and command.

[CODEX] Random behavior must use the seed or deterministic stream supplied through the approved contract.

[CODEX] Domain operations must be atomic: a rejected command changes no authoritative value, sequence, ownership or ledger state.

[CODEX] **6. Task Packet**

[CODEX] Every DeepSeek task receives a unique identifier in the form `DS-xxx`.

[CODEX] Codex provides the base Git commit, target branch, objective, allowed paths, forbidden paths, required interfaces, relevant rules, acceptance tests, test command and stop conditions.

[CODEX] The task packet must be copied to Trae without paraphrasing that changes its authority or scope.

[CODEX] DeepSeek must compare the current branch and base commit with the task packet before editing.

[CODEX] If the base commit or branch differs, DeepSeek stops before writing and reports the mismatch.

[CODEX] **7. DeepSeek Delivery**

[CODEX] DeepSeek runs the task-level tests, checks Git status and commits only authorized files on the delegated branch.

[CODEX] The DeepSeek delivery report states the task identifier, commit hash, changed files, behavior implemented, tests and exact results, assumptions, unresolved issues and known risks.

[CODEX] Every non-empty line in that delivery report begins with `[DEEPSEEK]`.

[CODEX] DeepSeek must not claim that a stage, milestone, integration test, Web export or release is complete.

[CODEX] DeepSeek must not merge or push changes to `main`.

[CODEX] **8. Codex Review and Integration**

[CODEX] The owner or operator tells Codex that a named DeepSeek task is ready; Codex then reads the branch and commit directly from the shared repository.

[CODEX] Codex verifies path ownership, reviews the complete diff, reruns the delegated tests and runs every affected integration and regression test.

[CODEX] Codex may reject the delivery, issue a correction packet or integrate it without preserving the contractor commit as a main-branch commit.

[CODEX] Accepted DeepSeek changes are normally applied to the integration work without an automatic commit so the approved milestone retains its mandatory reviewed stage commit.

[CODEX] The main-branch stage report records the accepted `DS-xxx` identifiers and identifies any Codex corrections made during integration.

[CODEX] **9. Stop Conditions**

[CODEX] DeepSeek stops before implementation if documentation conflicts, a required value is absent, a requested behavior exceeds the task, a Codex-owned file must change or a test requires an unavailable dependency.

[CODEX] DeepSeek stops before destructive Git operations, branch history rewriting, dependency installation, plugin installation, external downloads or system configuration changes.

[CODEX] Codex reports cross-agent conflicts, repeated failures, scope pressure, unsafe assumptions and integration risk to the owner.

[CODEX] Only the owner may approve a material scope expansion or a permanent change to this ownership model.

[CODEX] **10. Initial Rollout**

[CODEX] Codex completes M0G environment, runtime, test-runner and Web-export foundations before delegating production domain logic.

[CODEX] M1A map art and district geometry remain owner-authored in Figma. Codex owns only intake validation, format conversion, Godot integration and test evidence; neither Codex nor DeepSeek may invent or redraw district boundaries.

[CODEX] The first expected DeepSeek production task is an M1B pure geometry or content-validation service after Codex defines its contract and fixtures.

[CODEX] The ownership model is reviewed after the first accepted task; expanded DeepSeek permissions require an owner-approved protocol revision.
