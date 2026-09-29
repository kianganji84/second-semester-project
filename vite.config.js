import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(['index', 'login', 'super-market', 'digikala-food', 'product'].map(name => [name, resolve(import.meta.dirname, `${name}.html`)]))
    }
  }
});
