import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useUserContext } from "../context/user.context";
import { trpc } from "../util/trpc";

export default function Navbar() {
  const user = useUserContext();
  const router = useRouter();

  const { mutate } = trpc.useMutation(["users.sign-out"], {
    onSuccess: () => {
      router.reload();
    },
  });

  async function signOut() {
    mutate();
  }

  return (
    <nav className="navbar">
      <Link href="/" passHref>
        <a className="flex-1 text-xl">tRPC blog</a>
      </Link>
      <div className="gap-3">
        {user ? (
          <>
            <button className="btn btn-ghost" onClick={signOut}>
              Sign Out
            </button>
            <Link passHref href="/posts/new">
              <a className="btn">Create Post</a>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <a className=" btn btn-ghost">Login</a>
          </Link>
        )}
      </div>
    </nav>
  );
}
