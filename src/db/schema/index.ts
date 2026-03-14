import { users } from './auth'
import { quiz, questions, quizQuestions, quizTakers } from './exams'
// Export semua schema dari sini
// Tambahkan schema baru di sini, contoh:
// export * from './documents'
// export * from './categories'


export const Table = {
    users: users,

    // Quiz
    quiz: quiz,
    questions: questions,
    quizQuestions: quizQuestions,
    quizTakers: quizTakers,
   

} as const

export type TableSchema = typeof Table    