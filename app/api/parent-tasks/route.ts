import { GET as getTasks } from "@/app/api/tasks/route";
export async function GET(request: Request) {
  const url = new URL(request.url);
  url.searchParams.set("mode", "choices");
  return getTasks(new Request(url, request));
}
