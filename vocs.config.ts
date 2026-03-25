import { defineConfig } from 'vocs';

export default defineConfig({
  title: 'wnhlee.dev',
  description: 'personal blog by wnhlee',
  twoslash: {
    compilerOptions: {
      strict: true,
      jsx: 4, // JsxEmit.ReactJSX
      jsxImportSource: 'react',
    },
  },
  blogDir: './pages',
  topNav: [{ text: 'Github', link: 'https://github.com/2wheeh' }],
});
