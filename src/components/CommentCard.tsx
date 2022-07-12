import { Comment } from "@prisma/client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../util/trpc";

interface CommentProps {
  comment: Comment;
  postId: string;
}

export default function CommentCard({ comment, postId }: CommentProps) {
  const parentId = comment.id;
  const utils = trpc.useContext();
  const { handleSubmit, register, reset } = useForm();

  //fetch comments

  const { mutate, error } = trpc.useMutation(["comments.create-comment"], {
    onSuccess() {
      utils.invalidateQueries(["posts.single-post"]);
    },
  });

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
      {/* {data.Comment.filter(
      (comment) => comment.parentId === parentId
    ).map((comment) => {
      <div className="" key={parentId}>
        <div className="text-xl font-medium">
          {comment.comment} Hello
        </div>
        <form
          onSubmit={handleSubmit((values) =>
            addReply({ ...values, parentId })
          )}
          className="collapse"
        >
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
      </div>;
    })} */}
    </div>
  );
}
