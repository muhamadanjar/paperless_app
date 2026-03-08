"use client";

import { useSearchParams } from "next/navigation";
import { Container, Card, CardContent, Typography, Box, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizResultsPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration errors with searchParams

  const isPassing = score >= 70;

  return (
    <Container maxWidth="md" className="py-12">
      <Card className="text-center p-8 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-4 ${isPassing ? 'bg-green-500' : 'bg-orange-500'}`} />
        
        <CardContent className="flex flex-col items-center">
          <Typography variant="h4" className="font-bold text-slate-800 dark:text-slate-100 mb-2 mt-4">
            Quiz Completed!
          </Typography>
          <Typography variant="body1" className="text-slate-500 dark:text-slate-400 mb-10">
            You have successfully completed the assessment. Here is your result:
          </Typography>
          
          <Box className="relative inline-flex mb-8">
            <CircularProgress 
              variant="determinate" 
              value={100} 
              size={200}
              thickness={4}
              className="text-slate-100 dark:text-slate-800 absolute"
            />
            <CircularProgress 
              variant="determinate" 
              value={score} 
              size={200}
              thickness={4}
              color={isPassing ? "success" : "warning"}
              className="relative z-10"
              sx={{ strokeLinecap: 'round' }}
            />
            <Box className="absolute inset-0 flex flex-col items-center justify-center">
              <Typography variant="h3" component="div" className={`font-bold ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {score}%
              </Typography>
              <Typography variant="caption" className="text-slate-500 uppercase tracking-wider font-semibold">
                Score
              </Typography>
            </Box>
          </Box>
          
          <div className="flex justify-center gap-8 mb-10 w-full max-w-sm">
            <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl flex-1 border border-green-100 dark:border-green-900/50">
              <CheckCircleIcon className="text-green-500 mb-2" fontSize="large" />
              <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-200">
                {correct}
              </Typography>
              <Typography variant="body2" className="text-slate-500 font-medium">Correct</Typography>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex-1 border border-orange-100 dark:border-orange-900/50">
              <CancelIcon className="text-orange-500 mb-2" fontSize="large" />
              <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-200">
                {total - correct}
              </Typography>
              <Typography variant="body2" className="text-slate-500 font-medium">Incorrect</Typography>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/quiz">
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                className="px-6 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Back to Dashboard
              </Button>
            </Link>
            
            <Link href="/quiz/advanced-react-patterns/take">
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
              >
                Retake Quiz
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
