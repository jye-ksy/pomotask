import Dashboard from "./_components/Dashboard";
import { api } from "~/trpc/server";

export default async function Page() {
  const projects = await api.project.getAllProjects.query();
  const tasks = await api.task.getAllUserTasks.query();

  return (
    <div className="w-full flex-col  ">
      <Dashboard projects={projects} tasks={tasks} />
    </div>
  );
}
