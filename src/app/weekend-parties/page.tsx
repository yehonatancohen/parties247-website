import { redirect } from "next/navigation";

export default function LegacyWeekendRedirect() {
  redirect("/day/weekend");
}
