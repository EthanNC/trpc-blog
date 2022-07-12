import { Comment, Post } from "@prisma/client";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import CommentList from "../../components/CommentList";
import { trpc } from "../../util/trpc";

export default function Page() {
  const router = useRouter();

  const postId = router.query.postId as string;

  const { data, isLoading } = trpc.useQuery(["posts.single-post", { postId }]);

  if (isLoading) {
    return <p>Loading posts</p>;
  }

  return (
    <main>
      <section className="">
        <div className="card">
          <h1 className="card-title">{data?.title}</h1>
          <p className="card-body">{data?.body}</p>
        </div>
        <CommentList postId={postId} comments={data?.Comment} />
      </section>
    </main>
  );
}
