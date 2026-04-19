import { Hono } from 'hono'
import { readDB, writeDB } from '../database.js'

export const itemsRoute = new Hono()

//Get
itemsRoute.get('/', (c) => {
  const items = readDB()
  return c.json(items)
})

//If Get Error/not found
itemsRoute.get('/:id', (c) => {
  const id = Number(c.req.param('id'))
  const items = readDB()
  const item = items.find((i: any) => i.id === id)
  if (!item) return c.json({ error: 'Barang tidak ditemukan' }, 404)
  return c.json(item)
})

//Post/Create
itemsRoute.post('/', async (c) => {
  const { name, stock, price } = await c.req.json()
  const items = readDB()
  const newItem = {
    id: items.length + 1,
    name,
    stock,
    price,
  }
  items.push(newItem)
  writeDB(items)
  return c.json(newItem, 201)
})

//Put/Update
itemsRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { name, stock, price } = await c.req.json()
  const items = readDB()
  const index = items.findIndex((i: any) => i.id === id)
  if (index === -1) return c.json({ error: 'Barang tidak ditemukan' }, 404)
  items[index] = { id, name, stock, price }
  writeDB(items)
  return c.json({ message: 'Barang berhasil diupdate' })
})

//delete
itemsRoute.delete('/:id', (c) => {
  const id = Number(c.req.param('id'))
  let items = readDB()
  items = items.filter((i: any) => i.id !== id)
  writeDB(items)
  return c.json({ message: 'Barang berhasil dihapus' })
})

//restock
itemsRoute.post('/:id/restock', async (c) => {
  const id = Number(c.req.param('id'))
  const { tambah } = await c.req.json()
  const items = readDB()
  const index = items.findIndex((i: any) => i.id === id)
  if (index === -1) return c.json({ error: 'Barang tidak ditemukan' }, 404)
  items[index].stock += tambah
  writeDB(items)
  return c.json({
    message: 'Stok berhasil ditambah',
    stok_sekarang: items[index].stock,
  })
})