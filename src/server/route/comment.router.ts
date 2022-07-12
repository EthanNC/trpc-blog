import {
  createCommentSchema,
  getSingleCommentSchema,
} from "../../schema/comment.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";

export const commentRouter = createRouter()
  .mutation("create-comment", {
    input: createCommentSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a comment while logged out",
        });
      }

      const { comment, parentId, postId } = input;

      if (parentId) {
        //return nested comment

        const data = await ctx.prisma.comment.create({
          data: {
            comment,
            post: {
              connect: {
                id: postId,
              },
            },
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
            parent: {
              connect: {
                id: parentId,
              },
            },
          },
        });

        return data;
      }

      const data = await ctx.prisma.comment.create({
        data: {
          comment,
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      return data;
    },
  })
  .mutation("delete-comment", {
    input: getSingleCommentSchema,
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not delete a comment while logged out",
        });
      }

      const data = await ctx.prisma.comment.findFirst({
        where: {
          id: input.commentId,
        },
        select: {
          userId: true,
        },
      });

      if (ctx.user.id !== data?.userId) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "User did not create comment",
        });
      }

      return ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });
    },
  });
