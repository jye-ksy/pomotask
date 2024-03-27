import { useDroppable } from "@dnd-kit/core";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import Task from "./Task";
import type { TaskState } from "../_context/DashboardContext";

type TaskColumnsProps = {
  title: string;
  tasks: TaskState[];
  handleAddNewTask: (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => void;
};

export default function TaskColumns({
  title,
  tasks,
  handleAddNewTask,
}: TaskColumnsProps) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  const status =
    title === "Not Started"
      ? "NOT_STARTED"
      : title === "In Progress"
        ? "IN_PROGRESS"
        : "COMPLETE";

  return (
    <div ref={setNodeRef}>
      {tasks?.map((task, index) => {
        return (
          <Task
            key={task.id}
            id={task.id}
            name={task.name}
            notes={task.notes}
            priority={task.priority}
            due={task.due}
            projectId={task.projectId}
            status={task.status}
            index={index}
            parent={title}
          />
        );
      })}
      <Button
        onClick={() => handleAddNewTask(status)}
        variant="outline"
        className="flex h-10 w-full"
      >
        <PlusIcon className="h-4 w-4" />
        <span className="pl-2">New Task</span>
      </Button>
    </div>
  );
}
