import { unstable_noStore as noStore } from "next/cache";
import ProjectForm from "~/app/_components/ProjectForm";
import { Navbar } from "./_components/Navbar";


export default async function Home() {
  noStore();
 
  return (
    <main className="min-h-screen ">
      <section className="container py-16"></section>
    </main>
  );
}
