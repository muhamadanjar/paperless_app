"use client";

import { Typography, Button, Container, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { QuizCard } from "@/components/quiz/QuizCard";

// Mock data for UI demonstration
const MOCK_QUIZZES = [
  {
    id: "1",
    name: "Advanced React Patterns",
    slug: "advanced-react-patterns",
    description: "Test your knowledge of hooks, context, higher-order components, and performance optimization techniques in React.",
    createdAt: new Date(),
    questionCount: 15,
  },
  {
    id: "2",
    name: "Data Structures & Algorithms",
    slug: "dsa-basics",
    description: "A comprehensive assessment covering arrays, trees, graphs, dynamic programming, and common sorting algorithms.",
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    questionCount: 25,
  },
  {
    id: "3",
    name: "TypeScript Fundamentals",
    slug: "ts-fundamentals",
    description: "Evaluate your understanding of typing features, interfaces, generics, and configuration options in TypeScript.",
    createdAt: new Date(Date.now() - 86400000 * 5),
    questionCount: 10,
  }
];

export default function QuizListPage() {
  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white mb-2">
            My Quizzes
          </Typography>
          <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
            Create, manage and share your knowledge assessments.
          </Typography>
        </div>
        
        <Link href="/quiz/create">
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2.5 shadow-md hover:shadow-lg transition-all"
          >
            Create Quiz
          </Button>
        </Link>
      </Box>
      
      {MOCK_QUIZZES.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_QUIZZES.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onDelete={(id) => console.log("Delete", id)} 
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 text-4xl">
            📝
          </div>
          <Typography variant="h5" className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
            No quizzes yet
          </Typography>
          <Typography className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
            Create your first quiz to start assessing your team or students' knowledge.
          </Typography>
          <Link href="/quiz/create">
            <Button variant="contained" className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-8">
              Create First Quiz
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
}
