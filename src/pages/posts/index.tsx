import Link from "next/link";
import { trpc } from "../../util/trpc";

export default function PostListingPage() {
  const { data, isLoading } = trpc.useQuery(["posts.posts"]);

  if (isLoading) {
    return <p>Loading </p>;
  }
  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-3">
        {data?.map((post) => {
          return (
            <article className="card card-actions" key={post.id}>
              <header className="card-title">{post.title}</header>
              <Link href={`/posts/${post.id}`}>
                <span className="btn btn-sm">Read More</span>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
