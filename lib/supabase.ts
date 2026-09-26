import { createClient } from "@supabase/supabase-js"

export type EvaluationType = "parcial_1" | "parcial_2" | "parcial_3" | "proyecto"

export type EvaluationFromSupabase = {
    id: number
    evaluation_type: EvaluationType
    status: "aprobado" | "reprobado"
    final_grade: number
    exercises?: Array<{
        id: number
        exercise_number: number
        score: number
        exercise_errors?: Array<{
            id: number
            error_title: string
            error_description: string
        }>
    }>
}

export type StudentFromSupabase = {
    id: number
    cedula: string
    full_name?: string
    nombre?: string
    evaluations?: EvaluationFromSupabase[]
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null

export const supabase =
    supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } }) : null

export async function verifySupabaseConnection() {
    if (!supabase) {
        const message =
            "Supabase no está configurado: faltan NEXT_PUBLIC_SUPABASE_URL y la clave pública de Supabase. Usa NEXT_PUBLIC_SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."

        return {
            ok: false,
            error: message,
            data: null,
        }
    }

    try {
        const { data, error } = await supabase.from("students").select("id").limit(1)

        if (error) {
            return { ok: false, error: error.message, data: null }
        }

        return { ok: true, error: null, data }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido al verificar la conexión."
        return { ok: false, error: message, data: null }
    }
}

function normalizeCedulaCandidates(rawCedula: string) {
    const trimmed = rawCedula.trim()
    const withoutPrefix = trimmed.replace(/^v[-\s]?/i, "")
    const candidates = new Set<string>([
        trimmed,
        trimmed.toUpperCase(),
        withoutPrefix,
        `V-${withoutPrefix}`,
        `v-${withoutPrefix}`,
    ])

    return Array.from(candidates).filter(Boolean)
}

export async function getStudentByCedula(cedula: string) {
    if (!supabase) {
        const error =
            "Falta configurar NEXT_PUBLIC_SUPABASE_URL y la clave pública de Supabase en el archivo .env."

        return {
            data: null,
            error,
        }
    }

    const candidates = normalizeCedulaCandidates(cedula)

    try {
        for (const candidate of candidates) {
            const query = `
                id,
                cedula,
                full_name,
                evaluations (
                    id,
                    evaluation_type,
                    status,
                    final_grade,
                    exercises (
                        id,
                        exercise_number,
                        score,
                        exercise_errors (
                            id,
                            error_title,
                            error_description
                        )
                    )
                )
            `

            const { data, error } = await supabase
                .from("students")
                .select(query)
                .eq("cedula", candidate)
                .maybeSingle()

            if (error) {
                return {
                    data: null,
                    error: error.message,
                }
            }

            if (data) {
                return {
                    data: data as StudentFromSupabase,
                    error: null,
                }
            }
        }

        return {
            data: null,
            error: null,
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido al consultar la base de datos."
        return {
            data: null,
            error: message,
        }
    }
}
