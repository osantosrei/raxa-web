import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TOKEN_KEY } from "@/lib/auth";

/**
 * Redirects incoming requests to /matches when an auth token cookie is present, otherwise to /login.
 *
 * Checks the server cookie store for the `TOKEN_KEY` cookie and performs a server-side redirect to the selected route.
 */
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;

  redirect(token ? "/matches" : "/login");
}
