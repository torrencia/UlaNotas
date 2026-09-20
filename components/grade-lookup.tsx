"use client"

import { useEffect, useState, type FormEvent } from "react"
import { GraduationCap, Search, User, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeCard } from "@/components/grade-card"
import {
  EVALUATION_LABELS,
  EVALUATION_ORDER,
  type EvaluationKey,
  type Student,
} from "@/lib/grades-data"
import { getStudentByCedula, type StudentFromSupabase, verifySupabaseConnection } from "@/lib/supabase"

const evaluationMap: Record<string, EvaluationKey> = {
  parcial_1: "parcial1",
  parcial_2: "parcial2",
  parcial_3: "parcial3",
  proyecto: "proyecto",
}

function mapStudentFromSupabase(student: StudentFromSupabase): Student {
  const mapped: Student = {
    cedula: student.cedula,
    nombre: student.full_name ?? student.nombre ?? "Estudiante",
    carrera: "Ingeniería de Software",
    evaluaciones: {},
  }

  for (const evaluation of student.evaluations ?? []) {
    const type = evaluation?.evaluation_type
    const key = type ? evaluationMap[type] : undefined
    if (!key) continue

    const current = mapped.evaluaciones[key] ?? []
    current.push({
      materia: EVALUATION_LABELS[key],
      nota: Number(evaluation.final_grade ?? 0),
      detalles: (evaluation.exercises ?? []).map((exercise) => ({
        ejercicio: Number(exercise.exercise_number ?? 0),
        score: Number(exercise.score ?? 0),
        errores: (exercise.exercise_errors ?? []).map((error) => ({
          titulo: error.error_title ?? "Error",
          descripcion: error.error_description ?? "",
        })),
      })),
    })
    mapped.evaluaciones[key] = current
  }

  return mapped
}

export function GradeLookup() {
  const [cedula, setCedula] = useState("")
  const [student, setStudent] = useState<Student | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    void verifySupabaseConnection()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const key = cedula.trim()

    if (!key) {
      setError("Ingresa tu número de cédula.")
      setStudent(null)
      return
    }

    if (!/^([Vv]-?)?\d+$/.test(key)) {
      setError("La cédula debe tener solo números o el prefijo V-.")
      setStudent(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const connectionCheck = await verifySupabaseConnection()

      if (!connectionCheck.ok) {
        throw new Error(connectionCheck.error ?? "No se pudo conectar a la base de datos.")
      }

      const { data, error: supabaseError } = await getStudentByCedula(key)

      if (supabaseError) {
        throw new Error(supabaseError)
      }

      if (!data) {
        setStudent(null)
        setError("No se encontraron calificaciones para esa cédula.")
        return
      }

      setStudent(mapStudentFromSupabase(data))
    } catch (err) {
      setStudent(null)
      setError(err instanceof Error ? err.message : "Hubo un problema al consultar la base de datos.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setStudent(null)
    setError(null)
    setCedula("")
  }

  if (student) {
    const availableTabs = EVALUATION_ORDER.filter(
      (key) => (student.evaluaciones[key]?.length ?? 0) > 0,
    )

    if (availableTabs.length === 0) {
      return (
        <div className="w-full max-w-[760px]">
          <Card className="overflow-hidden border-border/70 shadow-sm">
            <CardHeader className="border-b bg-muted/40 px-6 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="size-5" aria-hidden />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{student.nombre}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {student.carrera} · C.I. {student.cedula}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="shrink-0 border-slate-300 bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Nueva consulta
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-5 py-6 sm:px-7 sm:py-7">
              <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center">
                <p className="text-base font-medium text-foreground">Se encontró al estudiante, pero aún no tiene notas registradas.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  La cédula existe en la base, pero no hay evaluaciones asociadas para mostrar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="w-full max-w-[760px]">
        <Card className="overflow-hidden border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/60">
          <CardHeader className="border-b border-slate-800 bg-slate-900 px-6 py-5 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                  <User className="size-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-100 sm:text-2xl">{student.nombre}</CardTitle>
                  <CardDescription className="text-sm text-slate-300 sm:text-base">
                    {student.carrera} · C.I. {student.cedula}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="shrink-0 border-slate-700 bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700 hover:text-white"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Nueva consulta
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-5 py-6 sm:px-7 sm:py-7">
            <Tabs defaultValue={availableTabs[0]} className="w-full">
              <TabsList
                className="grid w-full gap-1 bg-slate-800 p-1"
                style={{ gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))` }}
              >
                {availableTabs.map((key) => (
                  <TabsTrigger key={key} value={key} className="text-xs text-slate-200 data-[state=active]:bg-slate-700 data-[state=active]:text-white sm:text-sm">
                    {EVALUATION_LABELS[key]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {availableTabs.map((key: EvaluationKey) => (
                <TabsContent key={key} value={key} className="mt-5">
                  <div className="flex flex-col gap-4">
                    {student.evaluaciones[key]?.map((grade, index) => (
                      <GradeCard key={`${key}-${index}`} grade={grade} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-[440px] border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/70 sm:max-w-[470px]">
      <CardHeader className="px-6 pb-5 pt-7 text-center sm:px-8">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-100 shadow-sm ring-1 ring-slate-700">
          <GraduationCap className="size-8" aria-hidden />
        </div>
        <CardTitle className="text-3xl tracking-tight text-slate-100 sm:text-[2rem]">Notas programación</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="cedula" className="text-base font-medium text-slate-200">
              Cédula de Identidad
            </Label>
            <Input
              id="cedula"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 12345678"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "cedula-error" : undefined}
              className="h-12 border-slate-700 bg-slate-800 text-base text-slate-100 placeholder:text-slate-400 focus-visible:ring-slate-500"
            />
          </div>

          {error && (
            <p
              id="cedula-error"
              role="alert"
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Consultando...
              </>
            ) : (
              <>
                <Search className="size-4" aria-hidden />
                Consultar Calificaciones
              </>
            )}
          </Button>

          <p className="text-center text-xs text-slate-400 sm:text-sm">
            Cédulas de ejemplo: 12345678
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
