"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizFormSchema, QuizFormValues } from "@/types/quiz";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface QuizFormProps {
  initialData?: Partial<QuizFormValues>;
  onSubmit: (data: QuizFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function QuizForm({ initialData, onSubmit, isSubmitting = false }: QuizFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue("name", newName, { shouldValidate: true });
    
    // Auto-generate slug from name if it hasn't been manually edited or if creating new
    if (!initialData?.slug && newName) {
      const generatedSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      <CardContent className="p-6 sm:p-8">
        <Typography variant="h5" component="h2" className="mb-6 font-semibold text-slate-800 dark:text-slate-100">
          {initialData ? "Edit Quiz" : "Create New Quiz"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
            fullWidth
            label="Quiz Name"
            placeholder="e.g. JavaScript Basics"
            {...register("name")}
            onChange={handleNameChange} // Override onChange to auto-generate slug
            error={!!errors.name}
            helperText={errors.name?.message}
            variant="outlined"
            className="bg-white dark:bg-slate-800/50 rounded-lg"
          />

          <TextField
            fullWidth
            label="Slug"
            placeholder="e.g. javascript-basics"
            {...register("slug")}
            error={!!errors.slug}
            helperText={errors.slug?.message || "Unique identifier for the quiz URL"}
            variant="outlined"
            className="bg-white dark:bg-slate-800/50 rounded-lg"
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="Briefly describe what this quiz is about..."
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            variant="outlined"
            className="bg-white dark:bg-slate-800/50 rounded-lg"
          />

          <TextField
            fullWidth
            label="Cover Image URL (Optional)"
            placeholder="https://example.com/image.jpg"
            {...register("image")}
            error={!!errors.image}
            helperText={errors.image?.message}
            variant="outlined"
            className="bg-white dark:bg-slate-800/50 rounded-lg"
          />

          <Box className="flex justify-end pt-4 gap-3">
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              className="px-6 py-2 rounded-lg"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Quiz" : "Create Quiz"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
