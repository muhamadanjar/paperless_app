"use client";

import { Box, Container } from "@mui/material";
import { QuizTake } from "@/components/quiz/QuizTake";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    answer: "1"
  }
];

export default function TakeQuizPage() {
  const router = useRouter();

  const handleQuizSubmit = (answers: Record<string, string>) => {
    console.log("Submitted answers:", answers);
    toast.success("Quiz submitted successfully!");
    
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
    <div className="bg-slate-50/50 dark:bg-slate-900 min-h-screen py-12 px-4">
      <QuizTake 
        quiz={MOCK_QUIZ}
        questions={MOCK_QUESTIONS}
        onSubmit={handleQuizSubmit}
      />
    </div>
  );
}
