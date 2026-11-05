import { defineConfig } from 'vite';

export default defineConfig({
  base: '/phonetic-quiz/',
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [{
    name: 'reload',
    configureServer(server) {
      const {
        ws,
        watcher
      } = server;
      watcher.on('change', () => {

        ws.send({
          type: 'full-reload',
        });

      });
    },
  },],
});
