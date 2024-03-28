import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";
import { convertSecondsToHMS } from "~/lib/utils";
type paramsType = {
  projectid: string;
};

export default async function ProjectPage({ params }: { params: paramsType }) {
  const { projectid } = params;

  const project = await api.project.getProjectById.query({ id: projectid });
  console.log(project?.tasks);
  const renderStatusTag = (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => {
    switch (status) {
      case "NOT_STARTED":
        return (
          <div className="w-24 rounded-xl bg-gray-100 text-center text-base">
            Not Started
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div className="w-24 rounded-xl bg-amber-100  text-center text-base">
            In Progress
          </div>
        );
      case "COMPLETE":
        return (
          <div className="w-24 rounded-xl bg-green-100 text-center text-base">
            Completed
          </div>
        );
    }
  };

  const renderPriorityTag = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    switch (priority) {
      case "HIGH":
        return (
          <div className="w-12 rounded-xl bg-red-200 text-center text-base">
            High
          </div>
        );
      case "MEDIUM":
        return (
          <div className="w-20 rounded-xl bg-amber-100 text-center text-base">
            Medium
          </div>
        );
      case "LOW":
        return (
          <div className="w-12 rounded-xl bg-green-100 text-center text-base">
            Low
          </div>
        );
    }
  };

  return (
    <div className="w-full flex-col">
      <div className="mx-8 flex flex-col items-center lg:mx-14">
        <div className="mb-12 flex w-full max-w-7xl flex-col items-start justify-center md:justify-start">
          <h1 className="mb-2 mt-12 flex justify-center text-3xl font-bold">
            {project?.name}
          </h1>
          <span className="text-lg font-medium text-muted-foreground">
            Here&apos;s a list of your tasks.
          </span>
        </div>
        <div className="w-full max-w-7xl">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                  <TableHead className="min-w-28 text-right">
                    Total Time
                  </TableHead>
                  <TableHead className="max-w-24 text-right">
                    Pomodoros
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project?.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium ">{task.name}</TableCell>
                    <TableCell className="max-w-8 truncate">
                      {task.notes}
                    </TableCell>
                    <TableCell>{renderStatusTag(task.status)}</TableCell>
                    <TableCell>{renderPriorityTag(task.priority!)}</TableCell>
                    <TableCell className="text-right">
                      {task.due?.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {task.Pomodoro
                        ? convertSecondsToHMS(
                            task.Pomodoro?.totalFocusTime +
                              task.Pomodoro?.totalRestTime,
                          )
                        : null}
                    </TableCell>
                    <TableCell className="text-right">
                      {task.Pomodoro?.pomodorosCompleted !== 0
                        ? task.Pomodoro?.pomodorosCompleted
                        : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
