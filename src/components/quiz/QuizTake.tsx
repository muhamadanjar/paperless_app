"use client";

import { useState } from "react";
import { 
  Typography, Card, CardContent, Box, Button, 
  LinearProgress, Radio, RadioGroup, FormControlLabel 
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface Question {
  id: string;
  question: string;
  options: { id?: string; label: string }[];
}

interface QuizTakeProps {
  quiz: {
    name: string;
    description: string | null;
  };
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function QuizTake({ quiz, questions, onSubmit, isSubmitting = false }: QuizTakeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!questions || questions.length === 0) {
    return (
      <Card className="text-center p-12 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl">
        <Typography variant="h5" color="textSecondary">No questions available for this quiz.</Typography>
      </Card>
    );
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;
  const isLastQuestion = currentIdx === questions.length - 1;
  const hasAnsweredCurrent = !!answers[currentQ.id];

  const handleSelectOption = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(c => c - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col min-h-[70vh]">
      {/* Quiz Header & Progress */}
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-slate-100 mb-2">
          {quiz.name}
        </Typography>
        <Typography variant="body1" className="text-slate-500 dark:text-slate-400 mb-6">
          Question {currentIdx + 1} of {questions.length}
        </Typography>
        
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </Box>

      {/* Question Card */}
      <Card className="flex-grow flex flex-col shadow-lg border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-8 sm:p-12 flex-grow flex flex-col">
          <Typography variant="h5" component="h2" className="font-medium text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
            {currentQ.question}
          </Typography>

          <RadioGroup 
            value={answers[currentQ.id] || ""} 
            onChange={(e) => handleSelectOption(e.target.value)}
            className="space-y-4 mt-auto mb-auto"
          >
            {currentQ.options.map((opt, i) => {
              const optValue = opt.id || i.toString();
              const isSelected = answers[currentQ.id] === optValue;
              
              return (
                <label 
                  key={optValue}
                  className={`
                    relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-500/10' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 bg-transparent'}
                  `}
                >
                  <Radio 
                    value={optValue}
                    color="primary"
                    className={`transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}
                  />
                  <Typography className={`ml-3 font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {opt.label}
                  </Typography>
                  
                  {isSelected && (
                    <div className="absolute right-4 text-indigo-600 dark:text-indigo-400">
                      <CheckCircleOutlineIcon />
                    </div>
                  )}
                </label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Box className="flex items-center justify-between">
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          startIcon={<NavigateBeforeIcon />}
          className="px-6 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent || isSubmitting}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            endIcon={<NavigateNextIcon />}
            className="px-8 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 shadow-none border-none"
          >
            Next
          </Button>
        )}
      </Box>
    </div>
  );
}
