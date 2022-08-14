/* eslint-disable react/prop-types */
import type { Comment } from "@prisma/client";
import { TreeItem } from "performant-array-to-tree";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../util/trpc";
import CommentCard from "./CommentCard";

interface CommentListProps {
  postId: string;
  comments: TreeItem[] | undefined;
}
const CommentList = ({ postId, comments }: CommentListProps) => {
  const utils = trpc.useContext();
  const { handleSubmit, register, reset } = useForm();

  const { mutate, error } = trpc.useMutation(["comments.create-comment"], {
    onSuccess() {
      utils.invalidateQueries(["posts.single-post"]);
    },
  });

  function addComment(values: any) {
    mutate({ ...values, postId });
    utils.invalidateQueries(["posts.single-post"]);
    reset();
  }

  return (
    <div className="">
      <div className="divider">
        <div className=" text-lg">Comments</div>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(addComment)}>
        {error && error.message}
        <textarea
          className="textarea input-primary"
          placeholder="Your comment"
          {...register("comment")}
        />
        <div className="inline-flex flex-row-reverse">
          <button className="btn btn-primary" type="submit">
            Comment
          </button>
        </div>
      </form>
      <div className="card">
        {/* renders top level comments */}
        {comments!
          .filter((comment) => comment.data.parentId === null)
          .map((comment) => {
            const parentId = comment.data.id;
            return (
              <Fragment key={parentId}>
                <CommentCard comment={comment} postId={postId} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default CommentList;
