"use client";
import { Card, CardContent } from "~/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/card-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { SelectGroup, SelectLabel } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import { api } from "~/trpc/react";
import { Textarea } from "~/components/ui/card-textarea";

type TaskProps = {
  id: string;
  name: string;
  notes: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  due?: Date;
  projectId?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
};

const taskSchema = z.object({
  name: z.string(),
  notes: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  project: z.string().optional(),
  due: z.date().optional(),
});

export default function Task({
  id,
  name,
  notes,
  priority,
  due,
  projectId,
  status,
}: TaskProps) {
  const { dashboard, dispatch } = useContext(DashboardContext)!;

  const { projects } = dashboard;
  const taskForm = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: name ? name : "",
      notes: notes ? notes : "",
      priority: priority ? priority : undefined,
      due: due ? due : undefined,
      project: projectId
        ? projects.find((project) => project.id === projectId)?.id
        : undefined,
    },
    mode: "onBlur", // Makes it call updateTask when the form goes out of focus
  });
  const updateTask = api.task.update.useMutation().mutate;
  const deleteTask = api.task.delete.useMutation().mutate;

  const handleTaskSubmit = (data: z.infer<typeof taskSchema>) => {
    dispatch({
      type: "update-task",
      payload: {
        id,
        name: data.name,
        notes: data.notes,
        priority: data.priority,
        projectId: data.project,
        due: data.due,
        status,
      },
    });

    updateTask({
      id,
      name: data.name,
      notes: data.notes,
      priority: data.priority,
      due: data.due,
      projectId: data.project,
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "delete-task",
      payload: {
        id,
      },
    });
    deleteTask({ id });
  };

  return (
    <Card className="mb-4 w-full">
      <CardContent>
        <Form {...taskForm}>
          <form onBlur={taskForm.handleSubmit(handleTaskSubmit)}>
            <div className="flex w-full flex-col pt-2">
              {/* Name input */}
              <FormField
                control={taskForm.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="name"
                          placeholder="Type a name..."
                          className="mb-4 resize-none overflow-hidden break-words border-none text-lg font-semibold outline-none focus-visible:ring-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              {/* Notes input */}
              <FormField
                control={taskForm.control}
                name="notes"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="notes"
                          placeholder="Type a description..."
                          className="font-md mb-4 resize-none overflow-hidden break-words border-none text-sm text-muted-foreground outline-none focus-visible:ring-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              {/* Priority select */}
              <FormField
                control={taskForm.control}
                name="priority"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        defaultValue={field.value ? field.value : undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="priority"
                          className={`mb-4 border-none ${!field.value && "text-muted-foreground"}  hover:bg-gray-100 focus:ring-transparent`}
                        >
                          <SelectValue placeholder="Add Priority" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="HIGH">
                            <div className="h-6 w-10 rounded-xl bg-red-200 pl-1">
                              High
                            </div>
                          </SelectItem>
                          <SelectItem value="MEDIUM">
                            <div className="h-6 w-16 rounded-xl bg-amber-100 pl-1">
                              Medium
                            </div>
                          </SelectItem>
                          <SelectItem value="LOW">
                            <div className="h-6 w-10 rounded-xl bg-green-100 pl-1">
                              Low
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              {/* Due Date Picker */}
              {/* To-do: Add a way to clear the date*/}
              <FormField
                control={taskForm.control}
                name="due"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "mb-4 w-full justify-start border-none text-left font-normal hover:bg-gray-100",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Add Due Date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  );
                }}
              />
              {/* Project select */}
              <FormField
                control={taskForm.control}
                name="project"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        defaultValue={field.value ? field.value : undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="project"
                          className={`border-none font-semibold ${!field.value && "text-muted-foreground"} hover:bg-gray-100 focus:ring-transparent`}
                        >
                          <SelectValue placeholder="Add Project" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            {projects.length > 0 ? (
                              projects.map((project) => {
                                return (
                                  <SelectItem
                                    key={project.id}
                                    value={project.id}
                                  >
                                    {project.name}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <SelectLabel>No projects found.</SelectLabel>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-mb-4 self-end"
                onClick={() => handleDelete()}
              >
                <TrashIcon className="h-4 w-4 " />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
