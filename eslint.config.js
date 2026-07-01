import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/dist', '**/build', '**/coverage', '**/node_modules']),

  // Base config — every TS/TSX file in the workspace. Mirrors the demo repo.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },

  // Component-layer boundaries — enforced inside @tms/ui only.
  //   primitives = brand- & form-factor-agnostic (touch AND desktop)
  //   desktop    = dashboard-only (hover, dense data, keyboard)
  //   mobile     = pwa-only (touch, small screen)
  // Rule: desktop and mobile NEVER import each other; both may use primitives;
  //       primitives import neither. The barrel (src/index.ts) is exempt so it
  //       can re-export every layer.
  // NOTE: exercised for real once components exist in Phase 2 — with no
  //       cross-layer imports yet, this currently has nothing to flag.
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['packages/ui/src/**/*'],
      'boundaries/elements': [
        { type: 'primitives', pattern: 'packages/ui/src/primitives/**/*' },
        { type: 'desktop', pattern: 'packages/ui/src/desktop/**/*' },
        { type: 'mobile', pattern: 'packages/ui/src/mobile/**/*' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'primitives', allow: ['primitives'] },
            { from: 'desktop', allow: ['primitives', 'desktop'] },
            { from: 'mobile', allow: ['primitives', 'mobile'] },
          ],
        },
      ],
    },
  },
])
