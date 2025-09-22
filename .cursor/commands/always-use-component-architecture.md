# Always Use Component Architecture

## Purpose

Ensure that all new React / Next.js tasks, features, and code you develop follow a component-based architecture. This is to support easier maintenance, clearer separation of concerns, better reusability, and scalable best practices.

## When to Apply

Use this command (e.g. via `/always-use-component-architecture`) whenever starting a new project, adding a new feature, refactoring, or expanding existing code.

## Guidelines

1. **Folder / File Structure**

   - Organize UI into reusable components. Create a `components/` directory (or whatever convention in your project) to house shared components.
   - Co-locate component styles and sub-components (e.g. `Button/`, `FormInput/`), each with its own folder (e.g. `Button/index.tsx`, `Button/Button.styles.ts`, etc.).
   - Pages / views in Next.js should be thin: mostly composition of components, not long procedural UI logic.

2. **Single Responsibility Principle (SRP)**

   - Each component should do one thing and do it well.
   - If a component grows too large (UI + logic + state), consider splitting into smaller presentational + container components.

3. **Props, State, and Data Flow**

   - Keep component props clear and minimal. Use typed props (via TypeScript) for better clarity.
   - Prefer to lift state up. Keep stateful logic outside deeply nested components when possible.
   - Use context, hooks, or state management libraries when state is shared and complex; but only if justified.

4. **Styling**

   - Prefer component-scoped styles (CSS Modules, styled-components, or whatever your stack uses) rather than global styles where possible.
   - Encapsulate styles so components are modular and portable.

5. **Reusability and Composition**

   - Favor composing smaller components over writing large monolith components.
   - Extract shared UI pieces into reusable components (buttons, form fields, layout wrappers, etc.).
   - Use higher-order components or hooks for shared logic, not duplicating code.

6. **Testing**

   - For new components, write unit tests (and possibly integration / snapshot tests) to ensure correct behavior.
   - Test edge cases and prop variations. Components should be resilient.

7. **Documentation & Prop-Types**

   - Document component purpose and API (expected props, default values, side effects).
   - If using TypeScript, ensure proper typing. If using PropTypes, maintain those.
   - Add comments / README if component architecture or flow isn’t immediately obvious.

8. **Performance & Optimization**
   - Avoid unnecessary re-renders: use `React.memo`, `useMemo`, `useCallback` where appropriate.
   - Lazy-load components/screens/routes if needed (e.g. dynamic imports in Next.js).
   - Keep component hierarchy sensible to avoid deeply nested trees that are hard to maintain.

## Checklist

- [ ] New feature/components are placed under `components/` (or equivalent) and follow folder-by-component layout
- [ ] Components have a single responsibility
- [ ] State is managed in upper layers or via context/hooks when needed
- [ ] Styles are component–scoped and modular
- [ ] Reusable patterns/components are extracted and shared
- [ ] Tests written for components (unit / snapshot etc.)
- [ ] Props/interfaces are clearly typed/documented
- [ ] Performance considerations applied (memoization, lazy loading etc.)

## Example

> When asked to build a “User Profile” section:
>
> - Create `components/UserProfile/` folder
> - Inside: `UserProfile.tsx`, `UserProfile.styles.tsx` (or equivalent), perhaps sub-components like `UserStats.tsx`, `UserAvatar.tsx`
> - The page (e.g. `pages/profile.tsx`) composes `UserProfile` and passes down props, state management happens above or via hooks/context

---
