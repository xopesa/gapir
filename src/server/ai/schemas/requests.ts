import { z } from "zod";

export const tutorDirectionSchema = z.enum(["uz_to_zh", "zh_to_uz"]);
export const tutorLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export const tutorTopicSchema = z.enum(["free_conversation", "greeting", "shopping", "restaurant", "travel", "work"]);

export const createAiSessionSchema = z.object({
  feature: z.literal("tutor").default("tutor"),
  direction: tutorDirectionSchema,
  level: tutorLevelSchema,
  topic: tutorTopicSchema,
}).strict();

export const textMessageSchema = z.object({
  clientMessageId: z.string().uuid().optional(),
  text: z.string().trim().min(1).max(4000),
  direction: tutorDirectionSchema.optional(),
  level: tutorLevelSchema.optional(),
  topic: tutorTopicSchema.optional(),
}).strict();

export type CreateAiSessionInput = z.infer<typeof createAiSessionSchema>;
export type TutorLevel = z.infer<typeof tutorLevelSchema>;
export type TutorTopic = z.infer<typeof tutorTopicSchema>;
