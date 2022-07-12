import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import CommentList from "../../components/CommentList";
import { useUserContext } from "../../context/user.context";
import { trpc } from "../../util/trpc";

export default function Page() {
  const router = useRouter();
  const user = useUserContext();
  const [deleted, setDeleted] = useState<boolean>(false);

  const postId = router.query.postId as string;

  const { data, isLoading } = trpc.useQuery(["posts.single-post", { postId }]);
  const { mutate } = trpc.useMutation(["posts.delete-post"]);

  if (isLoading) {
    return <p>Loading posts</p>;
  }
  function deletePost() {
    mutate({ postId });
    setDeleted(true);
  }

  //   const postDeleted: JSX.Element= () => {
  //     <main>
  //       <div className="alert alert-success"> Post Deleted</div>
  //       <Link href="/posts"></Link>
  //     </main>;
  //   };

  if (deleted) {
    return (
      <main>
        <div className="alert alert-success">
          Post Deleted
          <Link href="/posts" passHref>
            <a className="link link-primary">Return to Index</a>
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main>
      <section>
        <div className="card">
          <h1 className="card-title">{data?.title}</h1>
          <p className="card-body">{data?.body}</p>
        </div>
        <div className="card">
          <div className="avatar placeholder space-x-2">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
              <span className="">A</span>
            </div>
            <div className="font-semibold">{data?.user.name}</div>
          </div>
        </div>
        {user?.id === data?.userId && (
          <button onClick={deletePost} className="btn btn-error">
            Delete Post
          </button>
        )}
        <CommentList postId={postId} comments={data?.Comment} />
      </section>
    </main>
  );
}
