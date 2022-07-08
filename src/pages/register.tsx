import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../util/trpc";

export default function RegisterPage() {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();

  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onError: (error) => {},
    onSuccess: () => {
      router.push("/login");
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }
  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-3">
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          {error && error.message}
          <span>
            Already have an account Account?{" "}
            <Link href="/login">
              <a className="link">Register</a>
            </Link>
          </span>
          <input
            className="input input-bordered"
            type="email"
            placeholder="Email Address"
            {...register("email")}
          />
          <br />
          <input
            className="input input-bordered"
            type="text"
            placeholder="Your Name"
            {...register("name")}
          />
          <button className="btn" type="submit">
            {" "}
            Register
          </button>
        </form>
      </section>
    </main>
  );
}
