import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { Input } from "../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { api } from "~/trpc/react";
import { useToast } from "../../components/ui/use-toast";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";

//Zod form valdiation object
const formSchema = z.object({
  name: z.string().min(2).max(250, {
    message: "Project needs a name",
  }),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]),
  due: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  notes: z.string().min(0).max(160, {
    message: "Bio must not be longer than 30 characters.",
  }),
  project: z.string(),
});

export default function NewTaskForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [projectId, setProjectId] = useState("");
  const createTask = api.task.create.useMutation();
  const { toast } = useToast();
  const projects = api.project.getAllProjects.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "NOT_STARTED",
      priority: "LOW",
      notes: "",
      project: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createTask.mutate(
      {
        ...values,
        projectId,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          toast({
            title: "Success!",
            description: `Task: "${data.name}" has been created!`,
          });
          form.reset();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Error!",
            description: "Something went wrong with creating the project",
          });
        },
      },
    );
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Task Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex space-x-2"
                  defaultValue="NOT_STARTED"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NOT_STARTED" id="NOT_STARTED" />
                    <Label htmlFor="NOT_STARTED">Not Started</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IN_PROGRESS" id="IN_PROGRESS" />
                    <Label htmlFor="IN_PROGRESS">In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="COMPLETE" id="COMPLETE" />
                    <Label htmlFor="COMPLETE">Completed</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Choose date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup className="flex space-x-2" defaultValue="LOW">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LOW" id="LOW" />
                    <Label htmlFor="LOW">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MEDIUM" id="MEDIUM" />
                    <Label htmlFor="MEDIUM">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HIGH" id="HIGH" />
                    <Label htmlFor="HIGH">High</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter notes" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Project</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value === "" ? "Select project..." : value}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for project..."
                      className="h-9"
                    />
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {projects.data?.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={project.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setProjectId(project.id);
                            setOpen(false);
                          }}
                        >
                          {project.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === project.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button className="" type="submit">
          Create Task
        </Button>
      </form>
    </Form>
  );
}
