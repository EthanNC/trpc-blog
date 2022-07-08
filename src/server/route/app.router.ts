import { createRouter } from "../createRouter";
import { commentRouter } from "./comment.router";
import { postRouter } from "./post.router";
import { userRouter } from "./user.router";

export const appRouter = createRouter()
  .merge("users.", userRouter)
  .merge("posts.", postRouter)
  .merge("comments.", commentRouter);

export type AppRouter = typeof appRouter;
