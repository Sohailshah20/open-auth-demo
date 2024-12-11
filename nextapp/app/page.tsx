import { cookies } from "next/headers";
import Image from "next/image";

export default async function Home() {
  const cookie = await cookies();
  const name = cookie.get("user_email")?.value || "User";
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h1 style={{ fontWeight: "bold" }}>hello {name}</h1>
    </div>
  );
}
