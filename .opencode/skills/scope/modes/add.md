# Scope Mode: add (NexCommerce: enroll tasks into docs/todos.md)

## Add (enroll one ad hoc feature, lightweight)

Inferred when todos exist and the argument names a single feature or module: `/scope <a feature>` enrolls new todos tasks without planning again, for a feature invented partway through. No `add` subcommand to type.

1. Read `docs/todos.md` again and dedup against task IDs and titles: present at any status → extend that task, don't duplicate.
2. Ask only what's needed (a short panel if intent/tier is ambiguous, else infer): intent, workflow tier (only if it differs from the project default, else inherit), placement (which Wave/Phase section).
3. Offer the per feature Approach: top option `(recommended) inherit the project default`, plus the named approaches (Tracer Bullet · Skateboard · Facade (prototype grade) · Journey); tag beside the heading only if it differs from the header default.
4. Set `Needs spec?` with the invent test: would building it require a decision the engineer has not made? Yes for a provider/library choice, a data model, a cross cutting pattern, the design system, a whole page/screen with no spec yet, or behavior that is not trivial (search, filtering, recommendations). No only for pure implementation an existing `design.md`/spec/convention covers. Unsure → yes; `GA`/`Beta` tier → almost always yes. Yes means its next step is `/architect <feature>`.
5. Append: new todos tasks with the next free IDs in their prefix group (check Appendix A for the highest used number) under the right Wave/Phase section, each with intent, a `Verify:` line, and US/FR references. Also mirror the status into `docs/progress.md` if a module row is affected.
6. Report briefly (mode: add): the task IDs, tier (inherited or overridden), approach (inherited or overridden), Needs spec, next command.
