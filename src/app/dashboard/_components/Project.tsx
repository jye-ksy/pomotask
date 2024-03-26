import { useContext } from "react";
import { z } from "zod";
import { DashboardContext } from "../_context/DashboardContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Textarea } from "~/components/ui/card-textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";

type ProjectProps = {
  id: string;
  name: string;
  due?: Date;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  index: number;
};

const projectSchema = z.object({
  name: z.string(),
  due: z.date().optional(),
});

export default function Project({ id, name, due, status }: ProjectProps) {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { projects } = dashboard;

  // const { attributes, listeners, setNodeRef, transform} = useDraggable({
  //   id: name,
  //   data: {
  //       id,
  //       name,
  //       index,
  //       parent
  //   }
  // })

  // const style = transform ? {
  //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  // } : undefined;

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: name ? name : "",
      due: due ? due : undefined,
    },
    mode: "onBlur", // Makes it call updateProject when the form goes out of focus
  });

  const handleProjectSubmit = (data: z.infer<typeof projectSchema>) => {
    console.log("project submitted");
    // Dispatch update-project action

    // Update project on db
  };

  const handleDelete = () => {
    // dispatch delete project
    // delete project on db
  };

  return (
    <Card
      className="mb-4 w-full"
      // style={style}
      // ref={setNodeRef}
    >
      <CardContent>
        <Form {...projectForm}>
          <form onBlur={projectForm.handleSubmit(handleProjectSubmit)}>
            <div className="flex w-full flex-col pt-2">
              <div className="flex w-full items-center">
                {/* Name input */}
                <FormField
                  control={projectForm.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="name"
                            placeholder="Type a name..."
                            className="resize-none overflow-hidden break-words border-none text-lg font-bold outline-none focus-visible:ring-transparent"
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                {/* <Button
                  variant={"ghost"}
                  {...attributes}
                  {...listeners}
                  className=" relative -ml-2 h-auto cursor-grab p-1 text-primary/50"
                >
                  <GripVertical />
                </Button> */}
              </div>
              {/* Due Date Picker */}
              {/* To-do: Add a way to clear the date*/}
              <FormField
                control={projectForm.control}
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
              <div className="-mb-4 flex self-end">
                {/* Delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete()}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
