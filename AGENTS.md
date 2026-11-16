# ANDROID-POS-01 Project Agent Guidelines

## Active Skills

| Skill | Path | When to Apply |
|---|---|---|
| `typescript` | `.agents/skills/typescript/SKILL.md` | Writing or modifying TypeScript types, interfaces, generics, type guards, and module imports. |
| `using-superpowers` | `skills/using-superpowers/SKILL.md` | Starting any conversation or task; enforces skill discovery, `gemini-tools.md` reference mapping (loaded via `GEMINI.md`), and Superpowers workflows (`brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, etc. in `skills/`). |

## Core TypeScript Rules (from `typescript` skill)

1. **Const Types Pattern**: Define `as const` objects first and extract union types using `(typeof OBJ)[keyof typeof OBJ]` for new/refactored status and enum-like types.
2. **Flat Interfaces**: Avoid inline nested object literals inside interfaces; extract dedicated interfaces instead.
3. **Never Use `any`**: Prefer `unknown` with runtime type guards (`value is T`) or generics (`<T>`).
4. **Utility Types**: Prefer `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, and `Record` over duplicating fields.
5. **Import Types**: Always use `import type` (or inline `type` specifier) when importing types only.
