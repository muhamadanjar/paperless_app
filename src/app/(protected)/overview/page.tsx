"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QuizIcon from "@mui/icons-material/Quiz";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Link from "next/link";
import { useSession } from "next-auth/react";

const MOCK_STATS = {
  totalQuizzes: 12,
  activeExams: 3,
  averageScore: 82,
  participants: 128,
};

const MOCK_RECENT = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    type: "Quiz",
    updatedAt: "Today",
    progress: 65,
  },
  {
    id: "2",
    name: "Final Exam – Web Development",
    type: "Exam",
    updatedAt: "Yesterday",
    progress: 40,
  },
  {
    id: "3",
    name: "TypeScript Basics",
    type: "Quiz",
    updatedAt: "2 days ago",
    progress: 90,
  },
];

export default function OverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const name = user?.name;
  const email = user?.email;
  const image = user?.image;
  console.log(user);
  return (
    <Box className="space-y-8">
      {/* Header + actions */}
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Box>
          <Typography
            variant="overline"
            className="tracking-[0.18em] text-xs text-sky-500/80"
          >
            DASHBOARD
          </Typography>
          <Typography
            variant="h4"
            className="font-semibold text-slate-900 dark:text-slate-50 mt-1"
          >
            Overview
          </Typography>
          <Typography
            variant="body2"
            className="text-slate-600 dark:text-slate-400 mt-1"
          >
            Pantau performa quiz, exam, dan aktivitas peserta dalam satu
            tampilan ringkas.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Link href="/quiz/create">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Buat Quiz
            </Button>
          </Link>
          <Link href="/exams">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<QuizIcon />}
            >
              Lihat Exams
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    className="text-slate-500 dark:text-slate-400"
                  >
                    Total Quizzes
                  </Typography>
                  <Typography
                    variant="h5"
                    className="mt-1 font-semibold text-slate-900 dark:text-slate-50"
                  >
                    {MOCK_STATS.totalQuizzes}
                  </Typography>
                </Box>
                <Box className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300 flex items-center justify-center">
                  <QuizIcon fontSize="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    className="text-slate-500 dark:text-slate-400"
                  >
                    Active Exams
                  </Typography>
                  <Typography
                    variant="h5"
                    className="mt-1 font-semibold text-slate-900 dark:text-slate-50"
                  >
                    {MOCK_STATS.activeExams}
                  </Typography>
                </Box>
                <Box className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center justify-center">
                  <AccessTimeIcon fontSize="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box className="flex-1">
                  <Typography
                    variant="body2"
                    className="text-slate-500 dark:text-slate-400"
                  >
                    Average Score
                  </Typography>
                  <Typography
                    variant="h5"
                    className="mt-1 font-semibold text-slate-900 dark:text-slate-50"
                  >
                    {MOCK_STATS.averageScore}%
                  </Typography>
                  <Box className="mt-2">
                    <LinearProgress
                      variant="determinate"
                      value={MOCK_STATS.averageScore}
                    />
                  </Box>
                </Box>
                <Box className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 flex items-center justify-center ml-3">
                  <TimelineIcon fontSize="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    className="text-slate-500 dark:text-slate-400"
                  >
                    Participants
                  </Typography>
                  <Typography
                    variant="h5"
                    className="mt-1 font-semibold text-slate-900 dark:text-slate-50"
                  >
                    {MOCK_STATS.participants}
                  </Typography>
                </Box>
                <Box className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 flex items-center justify-center">
                  <GroupIcon fontSize="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7">
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between mb-4">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-slate-900 dark:text-slate-50"
                >
                  Aktivitas Terbaru
                </Typography>
                <Chip
                  label="Mock data"
                  size="small"
                  variant="outlined"
                  color="default"
                />
              </Box>

              <Box className="space-y-3">
                {MOCK_RECENT.map((item) => (
                  <Box
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5"
                  >
                    <Box className="flex flex-col">
                      <Typography className="font-medium text-slate-900 dark:text-slate-50">
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-slate-500 dark:text-slate-400"
                      >
                        {item.updatedAt} • {item.type}
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-3">
                      <Box className="hidden sm:block w-32">
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        className="text-slate-600 dark:text-slate-300 w-10 text-right"
                      >
                        {item.progress}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card>
            <CardContent>
              <Typography
                variant="subtitle1"
                className="font-semibold text-slate-900 dark:text-slate-50 mb-3"
              >
                Quick Tips
              </Typography>
              <Box className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  • Gunakan kombinasi quiz singkat dan exam panjang untuk
                  mendapatkan gambaran utuh performa peserta.
                </p>
                <p>
                  • Cek rata‑rata skor secara rutin untuk mengukur efektivitas
                  materi yang diberikan.
                </p>
                <p>
                  • Manfaatkan halaman <strong>Quiz</strong> untuk mengelola
                  bank soal sebelum dijadikan exam.
                </p>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
}