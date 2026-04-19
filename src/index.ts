import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { itemsRoute } from './routes/items.js'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Inventory API berjalan!' }))

app.route('/items', itemsRoute)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server berjalan di http://localhost:${info.port}`)
})