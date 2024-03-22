"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import KanbanLane from "./KanbanLane";
import {
  DndContext,
  closestCorners,
  rectIntersection,
  DragEndEvent,
} from "@dnd-kit/core";

enum Priority {
  low = "LOW",
  medium = "MEDIUM",
  high = "HIGH"
}

enum Status {
  NOT_STARTED="NOT_STARTED",
  IN_PROGRESS="IN_PROGRESS",
  COMPLETE="COMPLETE"
}


type ReturnData = {
  id: string;
  name: string;
  priority: Priority;
  createdAt: Date;
  due: Date | null;
  updatedAt: Date;
  status: Status;
  completed: boolean;
  notes: string | null;
  projectId: string | null;
  userId: string;
}

export default function KanbanBoard() {
  const params = useParams();
  const { projectid } = params; 
  const project = api.project.getAllProjectTasks.useQuery(projectid);
  const updateTask = api.task.updateTaskStatus.useMutation();

  const [notStartedItems, setNotStartedItems] = useState([]);
  const [inProgressItems, setInProgressItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);


  useEffect(() => {
    if (project.data) {
      const newNotStartedItems = [];
      const newInProgressItems = [];
      const newCompletedItems = [];
  
      project.data.tasks.forEach(task => {
        if (task.status === 'NOT_STARTED') {
          newNotStartedItems.push(task);
        } else if (task.status === 'IN_PROGRESS') {
          newInProgressItems.push(task);
        } else if (task.status === 'COMPLETE') {
          newCompletedItems.push(task);
        }
      });
  
      setNotStartedItems(newNotStartedItems);
      setInProgressItems(newInProgressItems);
      setCompletedItems(newCompletedItems);
    }
  }, [project.data]);



  //Event listener to handle drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    //Need to use active and over to compare positioning between two elements
    const { active, over } = event;
    //container is destination container
    const container = over?.id;
    const id = active.data.current?.id ?? "" ;
    const name = active.data.current?.name ?? "";
    const index = active.data.current?.index ?? "";
    //parent is where the task is moved from
    const parent = active.data.current?.parent ?? "Not Started";

    //Update new container with moved item
    if (container === "Not Started") {
      updateTask.mutate({
        id,
        status: "NOT_STARTED"
      }, {
        onSuccess: data => {
          setNotStartedItems([...notStartedItems, { name }]);
        }
      })
    } else if (container === "In Progress") {
      updateTask.mutate({
        id,
        status: "IN_PROGRESS"
      }, {
        onSuccess: data => {
          setInProgressItems([...inProgressItems, { name }]);
        }
      })
    } else {
      updateTask.mutate({
        id,
        status: "COMPLETE"
      }, {
        onSuccess: data => {
          setCompletedItems([...completedItems, { name }]);
        }
      })      
    }

    //Remove the moved item from the parent container
    if (parent === "Not Started") {
      setNotStartedItems([
        ...notStartedItems.slice(0, index),
        ...notStartedItems.slice(index + 1),
      ]);
    } else if (parent === "Completed") {
      setCompletedItems([
        ...completedItems.slice(0, index),
        ...completedItems.slice(index + 1),
      ]);
    } else {
      setInProgressItems([
        ...inProgressItems.slice(0, index),
        ...inProgressItems.slice(index + 1),
      ]);
    }

  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="container mx-auto flex h-full w-full gap-4">
        <KanbanLane title="Not Started" items={notStartedItems} />
        <KanbanLane title="In Progress" items={inProgressItems} />
        <KanbanLane title="Completed" items={completedItems} />
      </div>
    </DndContext>
  );
}
