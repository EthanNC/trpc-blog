export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const url = `${baseUrl}/api/trpc`;

export const COMMENT_SELECT_FIELDS = {
  id: true,
  comment: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  votesUp: true,
  votesDown: true,
  userId: true,
  postId: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};
