import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const rootDir = path.resolve(process.cwd())
const envPath = path.join(rootDir, '.env')

function loadEnv(filePath) {
    const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
    const values = {}

    for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        const equalIndex = trimmed.indexOf('=')
        if (equalIndex === -1) continue

        const key = trimmed.slice(0, equalIndex).trim()
        const value = trimmed.slice(equalIndex + 1).trim().replace(/^['"]|['"]$/g, '')
        values[key] = value
    }

    return values
}

const env = loadEnv(envPath)
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
})

const cedula = '26123456'

const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('cedula', cedula)

if (error) {
    console.error('ERROR_QUERY')
    console.error(error.message)
    process.exit(1)
}

console.log('QUERY: select * from students where cedula = 26123456')
console.log(JSON.stringify(data, null, 2))
