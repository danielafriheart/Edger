import { config as loadEnv } from 'dotenv'
import { verifyToken } from '@clerk/backend'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

loadEnv()

const port = Number(process.env.PORT) || 3001
const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:5173'

const app = new Hono()

app.use(
  '/*',
  cors({
    origin: webOrigin,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
  }),
)

app.get('/health', (c) => c.json({ ok: true as const }))

app.get('/api/me', async (c) => {
  const clerkSecret = process.env.CLERK_SECRET_KEY
  if (!clerkSecret) {
    return c.json({ error: 'Server misconfigured' }, 500)
  }

  const header = c.req.header('Authorization')
  const bearer = header?.replace(/^Bearer\s+/i, '').trim()
  if (!bearer) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const decoded = await verifyToken(bearer, { secretKey: clerkSecret })
    return c.json({ userId: decoded.sub })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }
})

serve({
  fetch: app.fetch,
  port,
}, (addr) => {
  console.info(`[@edger/server] Listening on ${addr.address}:${addr.port}`)
})
