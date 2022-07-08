import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "../../util/trpc";

export default function Page() {
  const router = useRouter();
  const { handleSubmit, register, reset } = useForm();

  const utils = trpc.useContext();

  const postId = router.query.postId as string;

  const { data, isLoading, refetch } = trpc.useQuery([
    "posts.single-post",
    { postId },
  ]);
  const { mutate, error } = trpc.useMutation(["comments.create-comment"], {
    onSuccess() {
      utils.invalidateQueries(["posts.single-post"]);
    },
  });

  function addComment(values: any) {
    mutate({ ...values, postId });
    refetch();
    reset();
  }

  function addReply(values: any) {
    const { parentId } = values;
    const comment = values.replies[parentId].comment;
    mutate({ comment, parentId, postId });
  }

  if (isLoading) {
    return <p>Loading posts </p>;
  }

  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-3">
        <div className="card">
          <h1 className="card-title">{data?.title}</h1>
          <p className="card-body">{data?.body}</p>
        </div>
        <div className="divider">
          <div className=" text-lg">Comments</div>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(addComment)}
        >
          {error && error.message}
          <textarea
            className="textarea input-primary"
            placeholder="Your comment"
            {...register("comment")}
          />
          <button className="btn btn-primary" type="submit">
            Comment
          </button>
        </form>
        <div className="card">
          {/* renders top level comments */}
          {data?.Comment.filter((data) => data.parentId === null).map(
            (data) => {
              const parentId = data.id;
              return (
                <div className=" card-body" key={parentId}>
                  <div className="text-xl font-medium">{data.comment}</div>
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
                </div>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}
