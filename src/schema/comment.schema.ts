import z from "zod";

export const createCommentSchema = z.object({
  comment: z.string().min(5),
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

export type createCommentInput = z.TypeOf<typeof createCommentSchema>;

export const getSingleCommentSchema = z.object({
  commentId: z.string().uuid(),
});
