import { defineConfig } from 'prisma/config'
import Database from 'better-sqlite3'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'prisma/schema.prisma',
  },
  migrate: {
    adapter: () => {
      const db = new Database('prisma/dev.db')
      return new PrismaBetterSQLite3(db)
    },
    url: 'file:prisma/dev.db'
  }
})