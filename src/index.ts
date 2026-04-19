import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { snackRoute } from './routes/items.js'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Toko Snack Arta 🍪' }))

app.route('/snacks', snackRoute)

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server berjalan di http://localhost:${info.port}`)
})