import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import prisma from '../database.js'

export const snackRoute = new Hono()

// Schema validasi pakai zod
const snackSchema = z.object({
  name: z.string().min(1, 'Nama snack tidak boleh kosong'),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  category: z.string().min(1, 'Kategori tidak boleh kosong'),
})

//Get - Lihat semua snack
snackRoute.get('/', async (c) => {
  const snacks = await prisma.snack.findMany()
  return c.json(snacks)
})

//Get - Lihat 1 snack
snackRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const snack = await prisma.snack.findUnique({ where: { id } })
  if (!snack) return c.json({ error: 'Snack tidak ditemukan' }, 404)
  return c.json(snack)
})

//Post/Create - Tambah snack baru
snackRoute.post('/', zValidator('json', snackSchema), async (c) => {
  const { name, stock, price, category } = c.req.valid('json')
  const snack = await prisma.snack.create({
    data: { name, stock, price, category }
  })
  return c.json(snack, 201)
})

//Put/Update - Edit snack
snackRoute.put('/:id', zValidator('json', snackSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const { name, stock, price, category } = c.req.valid('json')
  const snack = await prisma.snack.update({
    where: { id },
    data: { name, stock, price, category }
  })
  return c.json(snack)
})

//Delete - Hapus snack
snackRoute.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await prisma.snack.delete({ where: { id } })
  return c.json({ message: 'Snack berhasil dihapus' })
})

//Restock untuk menambah stok snack
snackRoute.patch('/:id/restock', async (c) => {
  const id = Number(c.req.param('id'))
  const { tambah } = await c.req.json()
  const snack = await prisma.snack.findUnique({ where: { id } })
  if (!snack) return c.json({ error: 'Snack tidak ditemukan' }, 404)
  const updated = await prisma.snack.update({
    where: { id },
    data: { stock: snack.stock + tambah }
  })
  return c.json({ message: 'Stok berhasil ditambah!', stok_sekarang: updated.stock })
})