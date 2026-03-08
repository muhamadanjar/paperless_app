"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/navigation/navbar";
import { QuizTake } from "@/components/quiz/QuizTake";

type Props = {
  params: {
    slug: string;
  };
};

const MOCK_EXAM = {
  id: "exam-1",
  name: "Final Exam - Web Development",
  slug: "final-web-dev",
  description:
    "Ujian komprehensif untuk mengukur pemahaman Anda tentang konsep fundamental front-end dan best practice modern.",
};

const MOCK_EXAM_QUESTIONS = [
  {
    id: "q1",
    type: "multiple_choice" as const,
    question:
      "Manakah pernyataan yang PALING tepat menggambarkan konsep Single Page Application (SPA)?",
    options: [
      {
        id: "0",
        label:
          "Aplikasi yang selalu melakukan full page reload setiap navigasi.",
      },
      {
        id: "1",
        label:
          "Aplikasi yang merender seluruh halaman di server tanpa JavaScript.",
      },
      {
        id: "2",
        label:
          "Aplikasi yang melakukan initial load satu kali lalu mengubah konten melalui JavaScript tanpa full reload.",
      },
      {
        id: "3",
        label:
          "Aplikasi yang hanya bisa memiliki satu halaman HTML di dalam proyek.",
      },
    ],
  },
  {
    id: "q2",
    type: "essay" as const,
    question:
      "Jelaskan perbedaan antara SSR (Server-side Rendering) dan CSR (Client-side Rendering), serta sebutkan skenario kapan masing-masing lebih cocok digunakan.",
  },
];

export default function ExamPage({ params }: Props) {
  const handleExamSubmit = (answers: Record<string, string>) => {
    console.log("Submitted exam answers for", params.slug, answers);
    // Integrasi ke backend / penyimpanan hasil bisa ditambahkan di sini
  };

  return (
    <>
      <Box>
        <Navbar />
      </Box>

      <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-sky-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <QuizTake
            quiz={MOCK_EXAM}
            questions={MOCK_EXAM_QUESTIONS}
            onSubmit={handleExamSubmit}
          />
        </div>
      </div>
    </>
  );
}