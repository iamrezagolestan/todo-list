export async function signOut() {
  const response = await fetch("/api/auth/signout", { method: "POST" });
  if (!response.ok) throw new Error("Sign out failed");
}
