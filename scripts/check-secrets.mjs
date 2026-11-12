import { execFileSync } from 'node:child_process'

// Inspect the index (the contents that would be committed), not just disk files.
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const issues = []
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['Google API key', /\bAIza[A-Za-z0-9_-]{30,}\b/],
  ['service token', /\b(?:sk_live_|rk_live_|sk-proj-)[A-Za-z0-9_-]{16,}\b/],
  ['private machine path', /(?:\/home\/[^/\s]+\/|\/Users\/[^/\s]+\/|[A-Z]:\\Users\\[^\\\s]+\\)/],
  ['credential assignment', /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["'][A-Za-z0-9_+/=.-]{16,}["']/i],
]

for (const file of files) {
  const base = file.split('/').at(-1)
  if ((/^\.env(?:\.|$)/.test(base) && base !== '.env.example') || /\.(?:pem|key|p12|pfx)$/i.test(base) || /^(?:\.npmrc|\.pypirc|credentials\.json|service-account.*\.json)$/.test(base)) {
    issues.push(`${file}: sensitive file must not be tracked`)
    continue
  }
  const content = execFileSync('git', ['show', `:${file}`])
  if (content.includes(0)) continue // Skip binary assets.
  const lines = content.toString('utf8').split('\n')
  lines.forEach((line, index) => {
    for (const [label, pattern] of patterns) {
      if (pattern.test(line)) issues.push(`${file}:${index + 1}: possible ${label}`)
    }
  })
}

if (issues.length) {
  console.error('Public-file safety check failed (matched values are redacted):\n' + issues.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Checked ${files.length} indexed files: no matching credential patterns or sensitive filenames found.`)
}
