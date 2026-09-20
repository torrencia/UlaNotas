CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL
);

CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    evaluation_type TEXT CHECK(evaluation_type IN ('parcial_1', 'parcial_2', 'parcial_3', 'proyecto')) NOT NULL,
    status TEXT CHECK(status IN ('aprobado', 'reprobado')) NOT NULL,
    final_grade REAL NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluation_id INTEGER NOT NULL,
    exercise_number INTEGER NOT NULL,
    score REAL NOT NULL,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
);

CREATE TABLE exercise_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    error_title TEXT NOT NULL,
    error_description TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE INDEX idx_students_cedula ON students (cedula);
CREATE INDEX idx_evaluations_student_id ON evaluations (student_id);
CREATE INDEX idx_exercises_evaluation_id ON exercises (evaluation_id);
CREATE INDEX idx_exercise_errors_exercise_id ON exercise_errors (exercise_id);
