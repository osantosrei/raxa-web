import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TOKEN_KEY } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;

  redirect(token ? "/matches" : "/login");
}
