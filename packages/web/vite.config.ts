import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import yaml from '@modyfi/vite-plugin-yaml';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    yaml(),
],
  base: '/bookstore/'
})
