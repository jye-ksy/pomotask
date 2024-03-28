import { CheckCircleIcon, CircleIcon, TimerIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

type paramsType = {
  projectid: string;
};

export default async function ProjectPage({ params }: { params: paramsType }) {
  const { projectid } = params;

  const project = await api.project.getProjectById.query({ id: projectid });

  const renderStatusTag = (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => {
    switch (status) {
      case "NOT_STARTED":
        return (
          <div className="flex text-lg">
            <CircleIcon className="mr-4 mt-[6px] h-[18px] w-[18px] text-muted-foreground" />
            Not Started
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div className="flex text-lg">
            <TimerIcon className="mr-4 mt-1 h-[22px] w-[22px] text-muted-foreground" />
            In Progress
          </div>
        );
      case "COMPLETE":
        return (
          <div className="flex text-lg">
            <CheckCircleIcon className="mr-4 mt-[6px] h-[19px] w-[19px] text-muted-foreground" />
            Completed
          </div>
        );
    }
  };

  const renderPriorityTag = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    switch (priority) {
      case "HIGH":
        return (
          <div className="w-12 rounded-xl bg-red-200 text-center text-base font-medium">
            High
          </div>
        );
      case "MEDIUM":
        return (
          <div className="w-20 rounded-xl bg-amber-100 text-center text-base font-medium">
            Medium
          </div>
        );
      case "LOW":
        return (
          <div className="w-12 rounded-xl bg-green-100 text-center text-base font-medium">
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
              <TableHeader className="">
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project?.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-lg font-medium">
                      {task.name}
                    </TableCell>
                    <TableCell className="max-w-8 truncate text-lg">
                      {task.notes}
                    </TableCell>
                    <TableCell className="text-lg">
                      {renderStatusTag(task.status)}
                    </TableCell>
                    <TableCell>{renderPriorityTag(task.priority!)}</TableCell>
                    <TableCell>{task.due?.toLocaleDateString()}</TableCell>
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
