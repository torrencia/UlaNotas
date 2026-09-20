import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PASSING_GRADE, type Grade } from "@/lib/grades-data"

export function GradeCard({ grade }: { grade: Grade }) {
  const approved = grade.nota >= PASSING_GRADE

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
          approved
            ? "border-slate-700 bg-slate-800/60 text-slate-200"
            : "border-red-700/60 bg-red-900/20 text-slate-200",
        )}
      >
        <div className="flex items-center gap-3">
          {approved ? (
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          ) : (
            <XCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
          )}
          <div className="flex flex-col">
            <span
              className={cn(
                "font-medium leading-tight",
                approved ? "text-slate-100" : "text-red-100",
              )}
            >
              {grade.materia}
            </span>
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                approved ? "text-emerald-300" : "text-red-300",
              )}
            >
              {approved ? "Aprobado" : "Reprobado"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span
            className={cn(
              "text-2xl font-bold tabular-nums leading-none",
              approved ? "text-emerald-300" : "text-red-300",
            )}
          >
            {grade.nota.toFixed(0)}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium",
              approved ? "text-emerald-300/80" : "text-red-300/80",
            )}
          >
            / 20
          </span>
        </div>
      </div>

      {grade.detalles &&
        grade.detalles.filter((detalle) => detalle.errores.length > 0).length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-slate-200 shadow-sm">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              Detalles de ejercicios
            </div>

            <div className="space-y-2.5">
              {grade.detalles
                .filter((detalle) => detalle.errores.length > 0)
                .map((detalle) => (
                  <div key={`${grade.materia}-${detalle.ejercicio}`} className="rounded-md border border-slate-700/50 bg-slate-800/60 p-2.5 text-slate-200">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-100">
                        Ejercicio {detalle.ejercicio}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {detalle.score.toFixed(0)} / 20
                      </span>
                    </div>

                    <ul className="mt-2 space-y-1.5 pl-3 text-xs text-white">
                      {detalle.errores.map((error, index) => (
                        <li key={`${detalle.ejercicio}-${index}`} className="list-disc text-white">
                          <span className="font-medium text-white">{error.titulo}:</span>{" "}
                          {error.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
    </>
  )
}
