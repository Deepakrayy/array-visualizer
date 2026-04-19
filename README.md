# Array Visualizer

Interactive React + TypeScript app for exploring sorting behavior with draggable arrays, live stats, and algorithm code views.

## Why the previous diff showed `-64`

The prior commit **replaced** the default Vite README instead of editing it in place, so Git counted most of the template text as deletions.  
If you want a smaller deletion count, keep useful template sections and add project-specific sections on top.

## Tech stack

- React 19 + Vite 7
- TypeScript
- Zustand for state management
- Tailwind CSS 4 + Radix UI primitives
- dnd-kit for drag-and-drop array interactions

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — type-check and build for production
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

## Vite + React plugin notes

This project uses Vite with the React plugin ecosystem. Common plugin options:

- `@vitejs/plugin-react` (Babel-based Fast Refresh)
- `@vitejs/plugin-react-swc` (SWC-based Fast Refresh)

## React Compiler

React Compiler is not enabled by default. See the official React docs if you want to opt in:

- https://react.dev/learn/react-compiler/installation

## ESLint type-aware configuration (optional)

For stricter production linting, you can switch from baseline recommended rules to type-aware rules.

```js
// eslint.config.js (example)
import tseslint from 'typescript-eslint'

export default tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
      },
    },
  },
)
```

## Notes for reducing noisy PR stats

- Prefer **editing sections** instead of replacing entire files.
- Keep reusable starter guidance if it still applies.
- Split docs work into small commits so reviewers can follow intent.
