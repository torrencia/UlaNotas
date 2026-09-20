export const PASSING_GRADE = 10

export type EvaluationKey = "parcial1" | "parcial2" | "parcial3" | "proyecto"

export type ExerciseError = {
  titulo: string
  descripcion: string
}

export type ExerciseDetail = {
  ejercicio: number
  score: number
  errores: ExerciseError[]
}

export type Grade = {
  materia: string
  nota: number
  detalles?: ExerciseDetail[]
}

export type Student = {
  cedula: string
  nombre: string
  carrera: string
  evaluaciones: Partial<Record<EvaluationKey, Grade[]>>
}

export const EVALUATION_LABELS: Record<EvaluationKey, string> = {
  parcial1: "Parcial 1",
  parcial2: "Parcial 2",
  parcial3: "Parcial 3",
  proyecto: "Proyecto",
}

export const EVALUATION_ORDER: EvaluationKey[] = [
  "parcial1",
  "parcial2",
  "parcial3",
  "proyecto",
]

// Datos de ejemplo. Escala sobre 20, aprobación con nota >= 10.
export const STUDENTS: Record<string, Student> = {
  "12345678": {
    cedula: "12345678",
    nombre: "Ana Pérez",
    carrera: "Ingeniería de Sistemas",
    evaluaciones: {
      parcial1: [
        { materia: "Programación I", nota: 18 },
        { materia: "Física General", nota: 11 },
      ],
      parcial2: [
        { materia: "Programación I", nota: 14 },
        { materia: "Física General", nota: 9 },
      ],
      parcial3: [
        { materia: "Programación I", nota: 19 },
        { materia: "Física General", nota: 15 },
      ],
      proyecto: [
        { materia: "Proyecto Integrador", nota: 17 },
      ],
    },
  },
  "87654321": {
    cedula: "87654321",
    nombre: "Carlos Gómez",
    carrera: "Administración",
    // Solo tiene registrados Parcial 1 y Parcial 2.
    evaluaciones: {
      parcial1: [
        { materia: "Contabilidad", nota: 9 },
        { materia: "Estadística", nota: 12 },
      ],
      parcial2: [
        { materia: "Contabilidad", nota: 16 },
        { materia: "Estadística", nota: 7 },
      ],
    },
  },
  "11223344": {
    cedula: "11223344",
    nombre: "María López",
    carrera: "Medicina",
    // Solo tiene registrados Parcial 1 y Proyecto.
    evaluaciones: {
      parcial1: [
        { materia: "Anatomía", nota: 19 },
        { materia: "Bioquímica", nota: 14 },
      ],
      proyecto: [
        { materia: "Proyecto Clínico", nota: 6 },
      ],
    },
  },
}
