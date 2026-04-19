import fs from 'node:fs'

const DB_FILE = 'inventory.json'

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]))
}

export function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(data)
}

export function writeDB(data: any[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}