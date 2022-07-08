import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../util/trpc";

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();

  const { data, isLoading, error } = trpc.useQuery(
    ["users.verify-otp", { hash }],
    {
      onError: (error) => {
        console.error(error);
      },
    }
  );

  if (isLoading) {
    return <p>Verifying....</p>;
  }

  router.push(data?.redirect.includes("login") ? "/" : data?.redirect || "/");

  return <p>Redirecting....</p>;
}

export default function LoginForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { handleSubmit, register } = useForm<CreateUserInput>();

  const { mutate, error } = trpc.useMutation(["users.request-otp"], {
    onSuccess: () => {
      setSuccess(true);
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate({ ...values, redirect: router.asPath });
  }

  const hash = router.asPath.split("#token=")[1];

  if (hash) {
    return <VerifyToken hash={hash} />;
  }
  return (
    <div>
      <span>
        Don't have an Account?{" "}
        <Link href="/register">
          <a className="link">Register</a>
        </Link>
      </span>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}

        {success && <p>Check your email</p>}
        <input
          className="input input-bordered"
          type="email"
          placeholder="Email Address"
          {...register("email")}
        />
        <br />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
