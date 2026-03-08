"use client";

import { Box, Container, Typography } from "@mui/material";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuizFormValues } from "@/types/quiz";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function CreateQuizPage() {
  const router = useRouter();

  const handleSubmit = async (data: QuizFormValues) => {
    // Mocking an API call
    console.log("Creating quiz", data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast.success("Quiz created successfully!");
        // Normally would redirect to the newly created quiz page
        router.push(`/quiz/${data.slug}`);
        resolve();
      }, 1000);
    });
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Box className="mb-6">
        <Link href="/quiz" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-4 font-medium text-sm">
          <ArrowBackIcon fontSize="small" className="mr-1" /> Back to Quizzes
        </Link>
        <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white mb-2">
          Create New Quiz
        </Typography>
        <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
          Set up the basic information for your new assessment.
        </Typography>
      </Box>

      <QuizForm onSubmit={handleSubmit} />
    </Container>
  );
}
