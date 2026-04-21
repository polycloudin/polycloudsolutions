import { redirect } from "next/navigation";

// Legacy /client/demo URL. Canonical is /client/kumar-textiles.
export default function DemoRedirect() {
  redirect("/client/kumar-textiles");
}
