import { defineConfig } from 'unlighthouse'

export default defineConfig({
  site: 'http://localhost:3000',
  outputPath: '.unlighthouse',
  debug: false,
  scanner: {
    device: 'desktop',
    samples: 1,
    throttle: false,
  },
})
