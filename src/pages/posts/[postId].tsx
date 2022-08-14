import { Comment } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import CommentList from "../../components/CommentList";
import { useUserContext } from "../../context/user.context";
import { trpc } from "../../util/trpc";
import { arrayToTree, TreeItem } from "performant-array-to-tree";

export default function Page() {
  const router = useRouter();
  const user = useUserContext();
  const utils = trpc.useContext();
  const [deleted, setDeleted] = useState<boolean>(false);
  const [comments, setComments] = useState<TreeItem[]>([]);

  const postId = router.query.postId as string;

  const { data: post, isLoading } = trpc.useQuery([
    "posts.single-post",
    { postId },
  ]);

  // const commentsByParentId = useMemo(() => {
  //   const group: Comment[] = [];
  //   comments.forEach((comment) => {
  //     const id = comment.parentId
  //     // group[comment.parentId] ||= [];
  //     group[].push(comment);
  //   });
  //   return group;
  // }, [comments]);

  useEffect(() => {
    if (post?.Comment == null) return;
    setComments(arrayToTree(post.Comment));
  }, [post?.Comment]);

  const { mutate } = trpc.useMutation(["posts.delete-post"], {
    onSuccess: () => {
      utils.invalidateQueries(["posts.posts"]);
    },
  });

  if (isLoading) {
    return <p>Loading posts</p>;
  }
  function deletePost() {
    mutate({ postId });
    setDeleted(true);
  }

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
          <h1 className="card-title">{post?.title}</h1>
          <p className="card-body">{post?.body}</p>
        </div>
        <div className="card">
          <div className="avatar placeholder space-x-2">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
              <span className="">A</span>
            </div>
            <div className="font-semibold">{post?.user.name}</div>
          </div>
        </div>
        {user?.id === post?.user.id && (
          <button onClick={deletePost} className="btn btn-error">
            Delete Post
          </button>
        )}
        <CommentList postId={postId} comments={comments} />
      </section>
    </main>
  );
}
