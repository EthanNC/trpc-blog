import { Comment } from "@prisma/client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/user.context";
import { trpc } from "../util/trpc";

interface CommentProps {
  comment: Comment;
  postId: string;
}

export default function CommentCard({ comment, postId }: CommentProps) {
  const parentId = comment.id;
  const user = useUserContext();
  const utils = trpc.useContext();
  const { handleSubmit, register, reset } = useForm();

  //fetch comments

  const { mutate, error } = trpc.useMutation(["comments.create-comment"], {
    onSuccess() {
      utils.invalidateQueries(["posts.single-post"]);
    },
  });

  const { mutate: deleteComment } = trpc.useMutation(
    ["comments.delete-comment"],
    {
      onSuccess() {
        utils.invalidateQueries(["posts.single-post"]);
      },
    }
  );

  function addReply(values: any) {
    const { parentId } = values;
    const comment = values.replies[parentId].comment;
    console.log(comment, parentId, postId);
    mutate({ comment, parentId, postId });
    utils.invalidateQueries(["posts.single-post"]);
    reset();
  }

  return (
    <div className="card-body">
      <div className="text-xl font-medium">{comment.comment}</div>
      <span>
        <label>ID:</label>
        {comment.id}
      </span>
      <span>
        <label>parentId:</label>
        {comment.parentId}
      </span>
      <div>
        {user?.id === comment?.userId && (
          <button
            onClick={() => deleteComment({ commentId: comment.id })}
            className="btn btn-error"
          >
            Delete Comment
          </button>
        )}
      </div>
      <form
        onSubmit={handleSubmit((values) => addReply({ ...values, parentId }))}
        className="collapse"
      >
        {error && error.message}
        <input type="checkbox" {...register("checkbox")} />
        <div className="collapse-title link">Reply</div>
        <div className="collapse-content flex flex-col">
          <textarea
            className="textarea input-primary"
            placeholder="reply"
            {...register(`replies[${parentId}].comment`)}
          />
          <button className="btn btn-primary" type="submit">
            Reply
          </button>
        </div>
      </form>
      {/* @ts-ignore */}
      {(comment.Children || []).map((comment, key) => (
        <CommentCard
          key={`${comment.id}-${key}`}
          comment={comment}
          postId={postId}
        />
      ))}
    </div>
  );
}
