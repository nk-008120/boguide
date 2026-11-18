import js from '@eslint/js';
import globals from 'globals';

const rules = {
  ...js.configs.recommended.rules,
  'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
  'preserve-caught-error': 'off',
  'no-useless-assignment': 'error',
  eqeqeq: ['error', 'smart']
};

const ESCAPE_NAME = '/^(esc|escape(html|attr|text)?|esc(html|attr))$/i';
const USE_BIO_ESCAPE = 'Use window.bioEscape from static/js/bio-escape.js instead of a local HTML escape.';

const escapeRules = {
  'no-restricted-syntax': [
    'error',
    { selector: `FunctionDeclaration[id.name=${ESCAPE_NAME}]`, message: USE_BIO_ESCAPE },
    { selector: `VariableDeclarator[id.name=${ESCAPE_NAME}][init.type=/FunctionExpression$/]`, message: USE_BIO_ESCAPE },
    { selector: 'Literal[regex.pattern=/^\\[[^\\]]*[<>][^\\]]*\\]$/]', message: USE_BIO_ESCAPE },
    { selector: "CallExpression[callee.property.name=/^replace(All)?$/][arguments.0.regex.pattern=/^[<>&]$/][arguments.1.value=/^&[a-z#0-9]+;$/]", message: USE_BIO_ESCAPE }
  ]
};

export default [
  {
    ignores: [
      'node_modules/**',
      'public/**',
      'resources/**',
      'themes/**',
      'umami/**',
      'graphify-out/**',
      'static/vendor/**',
      'assets/vendor/**',
      'assets/home/vendor/**',
      'tests/**/node_modules/**',
      'context/**',
      'scratchpad/**',
      'bioguide_question_bank/**'
    ]
  },
  {
    files: ['api/**/*.js', 'scripts/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node } },
    rules
  },
  {
    files: ['scripts/*.mjs', 'tests/**/*.mjs', 'tests/**/*.js', 'eslint.config.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
    rules: { ...rules, 'no-new-func': 'off', 'no-script-url': 'off' }
  },
  {
    files: ['static/js/**/*.js', 'assets/home/*.js', 'assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        PapersAuth: 'writable',
        BioKnowledge: 'writable',
        SiteTutorial: 'writable',
        PostHogEvents: 'writable',
        supabase: 'readonly',
        posthog: 'readonly',
        gtag: 'readonly',
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        SplitText: 'readonly',
        ScrambleTextPlugin: 'readonly',
        Lenis: 'readonly',
        d3: 'readonly',
        topojson: 'readonly',
        Plotly: 'readonly',
        $3Dmol: 'readonly'
      }
    },
    rules: { ...rules, ...escapeRules }
  },
  {
    files: ['static/js/bio-escape.js'],
    rules: { 'no-restricted-syntax': 'off' }
  },
  {
    files: ['assets/js/core/**/*.js'],
    languageOptions: { globals: { setTheme: 'readonly', toggleMenu: 'readonly', resizeMenu: 'readonly' } }
  }
];
