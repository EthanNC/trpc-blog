import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import { AppRouter } from "../server/route/app.router";
import { url } from "../constants";
import { trpc } from "../util/trpc";
import { UserContextProvider } from "../context/user.context";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  const { data, isLoading, error } = trpc.useQuery(["users.me"]);

  if (isLoading) {
    return <p>Loading User</p>;
  }

  return (
    <UserContextProvider value={data}>
      <div className="layout">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [loggerLink(), httpBatchLink({ maxBatchSize: 10, url })];
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": 1,
          };
        }
        return {};
      },
      links,
      transformer: superjson,
    };
  },
  ssr: false,
})(MyApp);
