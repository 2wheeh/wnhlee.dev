import remarkDirective from 'remark-directive';
import { defineConfig } from 'vocs/config';

import { remarkPostDirectives } from './src/features/post/directives';

export default defineConfig({
  title: 'wnhlee.dev',
  description: 'personal blog by wnhlee',
  markdown: {
    // remark-directive is syntax-only (`::name` -> leafDirective nodes);
    // remarkPostDirectives defines what ::blog-posts / ::authors expand to.
    // Registered as user plugins so the txt (llms/markdown twin) pipeline —
    // which lacks vocs' built-in remarkDirective — parses them too.
    remarkPlugins: [remarkDirective, remarkPostDirectives],
  },
  twoslash: {
    twoslashOptions: {
      compilerOptions: {
        strict: true,
        jsx: 4, // JsxEmit.ReactJSX
        jsxImportSource: 'react',
        // Make browser APIs default over Node.js APIs
        // Node.js APIs is available with the inline flag `// @types: node` in a code block
        lib: ['lib.dom.d.ts', 'lib.dom.iterable.d.ts', 'lib.esnext.d.ts'],
        types: [],
      },
    },
  },
  topNav: [{ text: 'Github', link: 'https://github.com/2wheeh' }],
});
