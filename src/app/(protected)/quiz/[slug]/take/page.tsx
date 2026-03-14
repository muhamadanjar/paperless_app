"use client";

import { QuizTake } from "@/features/quiz/ui/quiz-take";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Alert, Typography } from "@mui/material";

// Mock Data
const MOCK_QUIZ = {
  id: "1",
  name: "Advanced React Patterns",
  slug: "advanced-react-patterns",
  description: "Test your knowledge of hooks, context, higher-order components, and performance optimization techniques in React.",
};

const MOCK_QUESTIONS = [
  {
    id: "q1",
    question: "Which hook should be used for data fetching in React 18+?",
    options: [
      { id: "0", label: "useEffect" },
      { id: "1", label: "useQuery from a library (like TanStack Query)" },
      { id: "2", label: "useFetch" },
      { id: "3", label: "Suspense with use hook" }
    ],
    answer: "3"
  },
  {
    id: "q2",
    question: "What is the primary purpose of React.memo?",
    options: [
      { id: "0", label: "To memoize expensive calculations" },
      { id: "1", label: "To prevent re-renders if props have not changed" },
      { id: "2", label: "To cache API responses" },
      { id: "3", label: "To create memoized callback functions" }
    ],
    answer: "1",
  },
  {
    id: "q3",
    question:
      "In your own words, explain the difference between useMemo and useCallback, dan kapan sebaiknya masing-masing digunakan.",
    type: "essay",
  },
];

export default function TakeQuizPage() {
  const router = useRouter();

  const handleQuizSubmit = (answers: Record<string, string>) => {
    console.log("Submitted answers:", answers);
    toast.info("Preview submitted (jawaban tidak benar-benar disimpan).");
    
    // Calculate score (mocking backend behavior)
    let correctCount = 0;
    MOCK_QUESTIONS.forEach(q => {
      if(answers[q.id] === q.answer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / MOCK_QUESTIONS.length) * 100);
    
    // Redirect to results (we'll just use a query param for simplicity in mock)
    router.push(`/quiz/${MOCK_QUIZ.slug}/results?score=${score}&correct=${correctCount}&total=${MOCK_QUESTIONS.length}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Alert severity="info" variant="outlined">
            <Typography variant="body2">
              Ini adalah <strong>preview</strong> quiz untuk pembuat / admin. Gunakan halaman{" "}
              <code>/exams/{MOCK_QUIZ.slug}</code> sebagai link yang dibagikan ke peserta untuk
              benar-benar mengerjakan quiz.
            </Typography>
          </Alert>
        </div>
        <QuizTake
          quiz={MOCK_QUIZ}
          questions={MOCK_QUESTIONS}
          onSubmit={handleQuizSubmit}
        />
      </div>
    </div>
  );
}
