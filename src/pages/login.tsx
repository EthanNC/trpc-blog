// import LoginForm from "../components/LoginForm";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-3">
        <LoginForm />
      </section>
    </main>
  );
}
