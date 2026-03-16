import { Typography, Card, CardContent, Chip, Box, IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { motion } from "motion/react";
interface QuizCardProps {
  quiz: {
    id: string;
    slug: string;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    questionCount?: number;
  };
  onDelete?: (id: string) => void;
}

export function QuizCard({ quiz, onDelete }: QuizCardProps) {
  const dateStr = quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "Unknown date";
  
  return (

    <Card component={motion.div}
     
    initial={{ opacity: 0, scale: 0.98, }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    animate={{ opacity: 1, scale: 1,}}
    
    className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden group">
      <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
      
      <CardContent className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-4">
          <Typography variant="h6" component="h3" className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
            {quiz.name}
          </Typography>
          
          <div className="flex -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="Edit">
              <Link href={`/quiz/${quiz.slug}`}>
                <IconButton size="small" color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip>
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => onDelete(quiz.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
        
        <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mb-6 flex-grow line-clamp-3">
          {quiz.description || "No description provided."}
        </Typography>
        
        <Box className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <Chip 
              label={`${quiz.questionCount || 0} Questions`} 
              size="small" 
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
            />
          </div>
          <Typography variant="caption" className="text-slate-400">
            {dateStr}
          </Typography>
        </Box>
      </CardContent>
      
      <Link href={`/quiz/${quiz.slug}/take`} className="w-full">
        <div className="w-full py-3 px-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors border-t border-slate-100 dark:border-slate-800 cursor-pointer">
          <PlayArrowIcon fontSize="small" />
          Take Quiz
        </div>
      </Link>
    </Card>
  );
}
