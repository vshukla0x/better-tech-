import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

test('deployment header configurations remain aligned and restrict scripts and framing', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  const staticHeaders = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  const headers = config.headers[0].headers as { key: string; value: string }[]
  for (const { key, value } of headers) expect(staticHeaders).toContain(`${key}: ${value}`)
  const csp = headers.find(h => h.key === 'Content-Security-Policy')!.value
  expect(csp).toContain("script-src 'self';")
  expect(csp).toContain("frame-ancestors 'none';")
  expect(csp).toContain("connect-src 'none';")
  expect(csp).not.toContain('unsafe-eval')
  expect(headers.find(h => h.key === 'X-Content-Type-Options')?.value).toBe('nosniff')
})

test('the environment template contains only comments and no credentials', () => {
  const env = readFileSync(new URL('../.env.example', import.meta.url), 'utf8')
  expect(env.split('\n').every(line => !line.trim() || line.trimStart().startsWith('#'))).toBe(true)
})
