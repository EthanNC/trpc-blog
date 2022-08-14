import * as trpc from "@trpc/server";
import { COMMENT_SELECT_FIELDS } from "../../constants";
import {
  createPostSchema,
  getSinglePostSchema,
} from "../../schema/post.schema";
import { createRouter } from "../createRouter";

export const postRouter = createRouter()
  .mutation("create-post", {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      return post;
    },
  })
  .query("posts", {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany();
    },
  })
  .query("single-post", {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          body: true,
          title: true,
          user: true,
          Comment: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              ...COMMENT_SELECT_FIELDS,
            },
          },
        },
      });
    },
  })
  .mutation("delete-post", {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const data = await ctx.prisma.post.findFirst({
        where: {
          id: input.postId,
        },
        select: {
          userId: true,
        },
      });

      if (ctx.user.id !== data?.userId) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "User did not create post",
        });
      }

      return ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    },
  });
