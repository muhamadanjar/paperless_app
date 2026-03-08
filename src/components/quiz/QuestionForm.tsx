"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionFormSchema, QuestionFormValues } from "@/types/quiz";
import { 
  TextField, Button, Card, CardContent, Typography, Box, 
  IconButton, Radio, RadioGroup, FormControlLabel, FormControl, 
  FormLabel, FormHelperText, Divider 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface QuestionFormProps {
  initialData?: Partial<QuestionFormValues>;
  onSubmit: (data: QuestionFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function QuestionForm({ initialData, onSubmit, isSubmitting = false }: QuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: initialData?.question || "",
      options: initialData?.options && initialData.options.length > 0 
        ? initialData.options 
        : [{ label: "" }, { label: "" }],
      answer: initialData?.answer || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const watchAnswer = watch("answer");

  return (
    <Card className="w-full shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <CardContent className="p-6">
        <Typography variant="h6" component="h3" className="mb-6 font-semibold text-slate-800 dark:text-slate-100">
          {initialData ? "Edit Question" : "Add Question"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
            fullWidth
            label="Question Text"
            placeholder="e.g. What is the output of typeof null in JavaScript?"
            multiline
            rows={3}
            {...register("question")}
            error={!!errors.question}
            helperText={errors.question?.message}
            variant="outlined"
            className="bg-white dark:bg-slate-800/50"
          />

          <Divider className="my-6" />

          <FormControl error={!!errors.answer} component="fieldset" className="w-full">
            <Box className="flex justify-between items-center mb-4">
              <FormLabel component="legend" className="font-medium text-slate-700 dark:text-slate-300">
                Options & Correct Answer
              </FormLabel>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => append({ label: "" })}
                variant="outlined"
                color="primary"
                className="rounded-full rounded-md"
              >
                Add Option
              </Button>
            </Box>
            
            <FormHelperText className="mb-4 mt-0 ml-0">
              Select the radio button next to the correct option.
            </FormHelperText>

            <RadioGroup
              value={watchAnswer}
              className="space-y-3"
            >
              {fields.map((field, index) => (
                <Box key={field.id} className="flex items-center gap-3">
                  <Radio
                    value={index.toString()} // Using index as value for mapping answer
                    {...register("answer")}
                    color="success"
                  />
                  
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Option ${index + 1}`}
                    {...register(`options.${index}.label`)}
                    error={!!errors.options?.[index]?.label}
                    helperText={errors.options?.[index]?.label?.message}
                    variant="outlined"
                    className="flex-grow bg-slate-50 dark:bg-slate-800/50"
                  />
                  
                  <IconButton 
                    onClick={() => remove(index)} 
                    disabled={fields.length <= 2}
                    color="error"
                    size="small"
                    className="opacity-60 hover:opacity-100 disabled:opacity-30"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              ))}
            </RadioGroup>
            
            {errors.answer && (
              <FormHelperText error>{errors.answer.message}</FormHelperText>
            )}
            {errors.options && !errors.options?.[0] && !errors.options?.[1] && (
               <FormHelperText error>{errors.options.message}</FormHelperText>
            )}
          </FormControl>

          <Box className="flex justify-end pt-4 gap-3 mt-8">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-none border-none"
            >
              {isSubmitting ? "Saving..." : "Save Question"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
