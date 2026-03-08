"use client";

import { useState } from "react";
import { 
  Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Button, Box, Chip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Question {
  id: string;
  question: string;
  options: { id?: string; label: string }[];
  answer: string;
}

interface QuestionListProps {
  questions: Question[];
  onAddQuestion: () => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

export function QuestionList({ questions, onAddQuestion, onEditQuestion, onDeleteQuestion }: QuestionListProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (questions.length === 0) {
    return (
      <Card className="border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">?</span>
          </div>
          <Typography variant="h6" className="text-slate-700 dark:text-slate-200 mb-2 font-semibold">
            No questions yet
          </Typography>
          <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Add questions to this quiz to get started. Participants won't be able to take an empty quiz.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onAddQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6"
          >
            Add First Question
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-semibold text-slate-800 dark:text-slate-100">
          Questions ({questions.length})
        </Typography>
        <Button 
          variant="contained" 
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddQuestion}
          className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-lg"
        >
          Add
        </Button>
      </Box>

      <div className="space-y-3">
        {questions.map((q, index) => (
          <Accordion 
            key={q.id} 
            expanded={expanded === q.id} 
            onChange={handleChange(q.id)}
            className="rounded-xl before:hidden border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900"
            disableGutters
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Box className="flex items-center w-full pr-4">
                <Box className="flex-grow flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <Typography className="font-medium text-slate-800 dark:text-slate-200 truncate pr-4">
                    {q.question}
                  </Typography>
                </Box>
                
                <Box className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditQuestion(q);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(q.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails className="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 p-6">
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const optValue = opt.id || i.toString();
                  const isCorrect = q.answer === optValue;
                  
                  return (
                    <div 
                      key={optValue} 
                      className={`
                        p-3 rounded-lg border flex items-center justify-between
                        ${isCorrect 
                          ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20' 
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}
                      `}
                    >
                      <Typography className={`text-sm ${isCorrect ? 'font-medium text-green-800 dark:text-green-300' : 'text-slate-600 dark:text-slate-300'}`}>
                        {String.fromCharCode(65 + i)}. {opt.label}
                      </Typography>
                      {isCorrect && (
                        <Chip label="Correct Answer" size="small" color="success" className="h-6 text-xs" />
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Box>
  );
}
