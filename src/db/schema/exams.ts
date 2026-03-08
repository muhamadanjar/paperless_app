import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const quiz = pgTable('quiz', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    image: text('image'),
    ownerId: text('ownerId').notNull().references(() => users.id),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})


export const questions = pgTable('questions', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    question: text('question').notNull(),
    options: json('options').notNull(),
    answer: text('answer').notNull(),
})


export const quizQuestions = pgTable('quiz_questions', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    quizId: text('quizId').notNull().references(() => quiz.id),
    questionId: text('questionId').notNull().references(() => questions.id),
})


export const quizTakers = pgTable('quiz_takers', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    quizId: text('quizId').notNull().references(() => quiz.id),
    userId: text('userId').notNull().references(() => users.id),
    score: integer('score').notNull(),
    answers: json('answers').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})


