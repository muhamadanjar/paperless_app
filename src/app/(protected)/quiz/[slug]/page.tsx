"use client";

import { useState } from "react";
import { 
  Box, Container, Typography, Tab, Tabs, Button, Dialog, DialogTitle, DialogContent, IconButton 
} from "@mui/material";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuestionForm } from "@/components/quiz/QuestionForm";
import { QuestionList } from "@/components/quiz/QuestionList";
import { QuizFormValues, QuestionFormValues } from "@/types/quiz";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quiz-tabpanel-${index}`}
      aria-labelledby={`quiz-tab-${index}`}
      {...other}
      className="pt-6"
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

// Mock Data
const MOCK_QUIZ = {
  id: "1",
  name: "Advanced React Patterns",
  slug: "advanced-react-patterns",
  description: "Test your knowledge of hooks, context, higher-order components, and performance optimization techniques in React.",
  image: "https://example.com/react.png",
};

const MOCK_QUESTIONS = [
  {
    id: "q1",
    question: "Which hook should be used for data fetching in React 18+?",
    options: [
      { id: "o1", label: "useEffect" },
      { id: "o2", label: "useQuery from a library (like TanStack Query)" },
      { id: "o3", label: "useFetch" },
      { id: "o4", label: "Suspense with use hook" }
    ],
    answer: "o4"
  },
  {
    id: "q2",
    question: "What is the primary purpose of React.memo?",
    options: [
      { id: "o1", label: "To memoize expensive calculations" },
      { id: "o2", label: "To prevent re-renders if props have not changed" },
      { id: "o3", label: "To cache API responses" },
      { id: "o4", label: "To create memoized callback functions" }
    ],
    answer: "o2"
  }
];

export default function EditQuizPage() {
  const [tabValue, setTabValue] = useState(0);
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuizSubmit = async (data: QuizFormValues) => {
    console.log("Updating quiz", data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast.success("Quiz updated successfully!");
        resolve();
      }, 1000);
    });
  };

  const handleQuestionSubmit = async (data: QuestionFormValues) => {
    console.log("Saving question", data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (editingQuestion) {
          // Update existing
          setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...data, id: q.id } : q) as any);
          toast.success("Question updated!");
        } else {
          // Add new
          setQuestions([...questions, { ...data, id: `q${Date.now()}` }] as any);
          toast.success("Question added!");
        }
        setDialogOpen(false);
        resolve();
      }, 500);
    });
  };

  const handleDeleteQuestion = (id: string) => {
    if(confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q.id !== id));
      toast.info("Question deleted");
    }
  };

  const openAddQuestion = () => {
    setEditingQuestion(null);
    setDialogOpen(true);
  };

  const openEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Link href="/quiz" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-2 font-medium text-sm">
            <ArrowBackIcon fontSize="small" className="mr-1" /> Back to Quizzes
          </Link>
          <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white mb-1">
            {MOCK_QUIZ.name}
          </Typography>
        </div>
        
        <Link href={`/quiz/${MOCK_QUIZ.slug}/take`}>
          <Button 
            variant="contained" 
            startIcon={<PlayArrowIcon />}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 shadow-md hover:shadow-lg transition-all"
          >
            Preview Quiz
          </Button>
        </Link>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="quiz configuration tabs">
          <Tab label="Questions" id="quiz-tab-0" aria-controls="quiz-tabpanel-0" />
          <Tab label="Settings" id="quiz-tab-1" aria-controls="quiz-tabpanel-1" />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={tabValue} index={0}>
        <div className="max-w-4xl mx-auto">
          <QuestionList 
            questions={questions}
            onAddQuestion={openAddQuestion}
            onEditQuestion={openEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      </CustomTabPanel>
      
      <CustomTabPanel value={tabValue} index={1}>
        <div className="max-w-4xl mx-auto">
          <QuizForm initialData={MOCK_QUIZ} onSubmit={handleQuizSubmit} />
        </div>
      </CustomTabPanel>

      {/* Question Form Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "bg-transparent shadow-none"
        }}
      >
        <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
          <IconButton
            onClick={() => setDialogOpen(false)}
            className="absolute top-2 right-2 z-10 bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700"
            size="small"
          >
            <CloseIcon />
          </IconButton>
          <QuestionForm 
            initialData={editingQuestion} 
            onSubmit={handleQuestionSubmit} 
          />
        </div>
      </Dialog>
    </Container>
  );
}