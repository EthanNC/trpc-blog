import { TreeItem } from "performant-array-to-tree";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/user.context";
import { trpc } from "../util/trpc";

interface CommentProps {
  comment: TreeItem;
  postId: string;
}

export default function CommentCard({ comment, postId }: CommentProps) {
  const parentId = comment.data.id;
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
    mutate({ comment, parentId, postId });
    utils.invalidateQueries(["posts.single-post"]);
    reset();
  }

  return (
    <div className="card-body">
      <div className="text-xl font-medium">{comment.data.comment}</div>
      <span>
        <label>ID:</label>
        {comment.data.id}
      </span>
      <span>
        <label>parentId:</label>
        {comment.data.parentId}
      </span>
      <div>
        {user?.id === comment?.data.userId && (
          <button
            onClick={() => deleteComment({ commentId: comment.data.id! })}
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
      {(comment.children || []).map((comment, key) => (
        <CommentCard
          key={`${comment.id}-${key}`}
          comment={comment}
          postId={postId}
        />
      ))}
    </div>
  );
}
