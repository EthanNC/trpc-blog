import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";
import { trpc } from "../util/trpc";

const Home: NextPage = () => {
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

  if (!user) {
    return <LoginForm />;
  }
  return (
    <>
      {user ? (
        <>
          <button className="btn" onClick={signOut}>
            Sign Out
          </button>
          <Link href="/posts/new">Create Post </Link>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </>
  );
};
export default Home;
