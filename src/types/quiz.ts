import { z } from "zod";

export const quizFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;

export const questionOptionSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, "Option text is required"),
});

export type QuestionOption = z.infer<typeof questionOptionSchema>;

export const questionFormSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(questionOptionSchema).min(2, "At least 2 options are required"),
  answer: z.string().min(1, "Please select the correct answer"), // references option.id or option.label
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export type QuizWithQuestions = {
  id: string;
  name: string | null;
  slug: string;
  description: string | null;
  image: string | null;
  ownerId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  questions: Array<{
    id: string;
    question: string;
    options: any; // json
    answer: string;
  }>;
};

export type QuizTakeAnswer = {
  questionId: string;
  answer: string; // The selected option
};
