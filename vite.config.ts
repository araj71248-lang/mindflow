
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: "/mindflow/",
    plugins: [react()],
    define: {
      // If you are pasting your key directly here, replace 'env.API_KEY || ...' 
      // with 'YOUR_KEY_STRING', but ALWAYS keep JSON.stringify() around it.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || 'AIzaSyBXp-AXyZy77Y05a3cAIbTU_C-68I-SpPY')
    },
    server: {
      port: 5173,
      open: true
    }
  };
});
