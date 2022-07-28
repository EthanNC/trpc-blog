import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../util/trpc";

export default function createPostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const utils = trpc.useContext();
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(["posts.create-post"], {
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`);
      utils.invalidateQueries(["posts.posts"]);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <>
      <form
        className=" flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && error.message}

        <input
          className="input input-bordered"
          type="text"
          placeholder="Title"
          required
          {...register("title")}
        />
        <textarea
          className="textarea"
          placeholder="Write your thoughts"
          required
          {...register("body")}
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}
