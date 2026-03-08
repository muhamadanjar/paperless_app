"use client";

import { useState } from "react";
import { 
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

type QuestionType = "multiple_choice" | "essay";

interface BaseQuestion {
  id: string;
  question: string;
  type?: QuestionType; // defaults to multiple_choice for backwards compatibility
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type?: "multiple_choice";
  options: { id?: string; label: string }[];
}

interface EssayQuestion extends BaseQuestion {
  type: "essay";
  options?: never;
}

type Question = MultipleChoiceQuestion | EssayQuestion;

interface QuizTakeProps {
  quiz: {
    name: string;
    description: string | null;
  };
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function QuizTake({
  quiz,
  questions,
  onSubmit,
  isSubmitting = false,
}: QuizTakeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!questions || questions.length === 0) {
    return (
      <Card className="text-center p-12 bg-white/90 dark:bg-slate-950/70 backdrop-blur-xl shadow-xl border border-sky-100/80 dark:border-slate-800/60 rounded-3xl">
        <Typography
          variant="h5"
          className="text-slate-800 dark:text-slate-100 mb-2 font-semibold tracking-tight"
        >
          No questions available
        </Typography>
        <Typography
          variant="body2"
          className="text-slate-500 dark:text-slate-400 max-w-md mx-auto"
        >
          This quiz doesn&apos;t have any questions yet. Please contact your
          instructor or try again later.
        </Typography>
      </Card>
    );
  }

  const currentQ = questions[currentIdx];
  const type: QuestionType = currentQ.type ?? "multiple_choice";
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const isLastQuestion = currentIdx === questions.length - 1;
  const hasAnsweredCurrent = !!answers[currentQ.id];

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((c) => c - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col min-h-[70vh]">
      {/* Quiz Header & Progress */}
      <Box className="mb-8">
        <div className="flex flex-col gap-2">
          <Typography
            variant="overline"
            className="tracking-[0.2em] text-xs text-sky-500/80"
          >
            {type === "essay" ? "EXAM" : "QUIZ"}
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            className="font-semibold text-slate-900 dark:text-slate-50 tracking-tight"
          >
            {quiz.name}
          </Typography>
          {quiz.description && (
            <Typography
              variant="body2"
              className="text-slate-600 dark:text-slate-400 max-w-2xl"
            >
              {quiz.description}
            </Typography>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 bg-sky-100 dark:bg-slate-800/70 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-linear-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Typography
            variant="body2"
            className="text-slate-300 min-w-[130px] text-right"
          >
            Question {currentIdx + 1} / {questions.length}
          </Typography>
        </div>
      </Box>

      {/* Question Card */}
      <Card className="grow flex flex-col shadow-xl shadow-sky-100/60 dark:shadow-sky-900/40 border border-sky-100/80 dark:border-slate-800/70 bg-white/95 dark:bg-slate-900/80 rounded-3xl overflow-hidden mb-6 backdrop-blur-xl">
        <CardContent className="p-6 sm:p-10 grow flex flex-col gap-8">
          <div className="space-y-3">
            <Typography
              variant="subtitle2"
              className="uppercase tracking-[0.25em] text-[11px] text-sky-500/90"
            >
              {type === "essay" ? "Essay Question" : "Multiple Choice"}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className="font-medium text-slate-900 dark:text-slate-50 leading-relaxed"
            >
              {currentQ.question}
            </Typography>
          </div>

          {type === "essay" ? (
            <div className="mt-4">
              <TextField
                multiline
                minRows={6}
                fullWidth
                placeholder="Tulis jawaban Anda di sini..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                variant="outlined"
                className="bg-sky-50/70 dark:bg-slate-950/60 rounded-2xl"
                InputProps={{
                  className:
                    "text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl",
                }}
              />
              <Typography
                variant="caption"
                className="block mt-3 text-slate-500 dark:text-slate-400"
              >
                Jawab dengan jelas dan terstruktur. Tidak ada opsi pilihan ganda
                untuk tipe soal ini.
              </Typography>
            </div>
          ) : (
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="space-y-4 mt-2"
            >
              {(currentQ as MultipleChoiceQuestion).options?.map((opt, i) => {
                const optValue = opt.id || i.toString();
                const isSelected = answers[currentQ.id] === optValue;

                return (
                  <label
                    key={optValue}
                    className={`
                      relative flex items-center p-4 cursor-pointer rounded-2xl border transition-all duration-200
                      ${
                        isSelected
                          ? "border-sky-500 bg-sky-50 dark:border-sky-500/90 dark:bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.4)]"
                          : "border-sky-100 bg-white dark:border-slate-700/80 dark:bg-slate-950/40 hover:border-sky-300 hover:bg-sky-50/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-900/70"
                      }
                    `}
                  >
                    <Radio
                      value={optValue}
                      color="primary"
                      className={`transition-transform duration-200 ${
                        isSelected ? "scale-110 text-sky-400" : ""
                      }`}
                    />
                    <Typography
                      className={`ml-3 font-medium ${
                        isSelected
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-700 dark:text-slate-200/90"
                      }`}
                    >
                      {opt.label}
                    </Typography>

                    {isSelected && (
                      <div className="absolute right-4 text-sky-500">
                        <CheckCircleOutlineIcon fontSize="small" />
                      </div>
                    )}
                  </label>
                );
              })}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Box className="flex items-center justify-between gap-4">
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          startIcon={<NavigateBeforeIcon />}
          className="px-6 py-2.5 rounded-2xl border-sky-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50/80 dark:border-slate-700/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900/80 disabled:opacity-50 disabled:border-slate-200 dark:disabled:border-slate-800"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent || isSubmitting}
            className="px-8 py-2.5 rounded-2xl bg-linear-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-semibold shadow-[0_18px_45px_rgba(56,189,248,0.35)] disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            endIcon={<NavigateNextIcon />}
            className="px-8 py-2.5 rounded-2xl bg-sky-100 text-slate-900 hover:bg-sky-200 font-medium shadow-md disabled:opacity-50"
          >
            Next
          </Button>
        )}
      </Box>
    </div>
  );
}
