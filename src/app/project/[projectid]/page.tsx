'use client';

import { useState } from "react";
import { api } from "~/trpc/react"
import { useRouter } from 'next/router';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "../../../components/ui/collapsible";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { ArrowRight, ArrowDown} from 'lucide-react';


type paramsType = {
    projectid: string;
}

const sampleData = [
    {
        task_name: 'Task 1',
        sub_tasks: [
            {
                sub_task_name: "Subtask #1",
                status: 'Not Started',
                assignee: "User 1",
                priority: "Medium",
                notes: "Do something",                
            },
            {
                sub_task_name: "Subtask #2",
                status: 'Not Started',
                assignee: "User 1",
                priority: "Low",
                notes: "Breh",                
            }
        ]
    },
    {
        task_name: 'Task 2',
        sub_tasks: [
            {
                sub_task_name: 'Task 2',
                status: 'Not Started',
                assignee: "User 2",
                priority: "Low",
                notes: ""
            }
        ]
    }
]


export default function ProjectPage({ params }: { params: paramsType }) {
    const { projectid } = params;
    const [isTabOpen, setIsTabOpen] = useState<string | null>(null)
    const project = api.project.getProjectById.useQuery({id: projectid});

    if (!project.data) {
        // Handle loading state or null data, e.g., show a loading spinner or a message
        return <div>Loading...</div>;
    }

    const { id, name} = project.data

    const handleOpenChange = (taskName: string) => {
        if (isTabOpen === taskName) {
            setIsTabOpen(null); // Close if it's already open
        } else {
            setIsTabOpen(taskName); // Open the clicked one
        }
    };

    return <div className="container py-16">
        <h1 className="font-bold text-xl mb-4">{name}</h1>
        <div className="container">
            {sampleData.map((task, index) => {
                return (
                    <Collapsible
                    key={index}
                    open={isTabOpen === task.task_name}
                    onOpenChange={() => handleOpenChange(task.task_name)}
                    >
                    <CollapsibleTrigger className="flex gap-2 items-center">
                        {isTabOpen === task.task_name ? <ArrowDown size={16}/>: <ArrowRight size={16}/>}
                        {task.task_name}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {/* START OF INNER SUB TASKS 
                            --------------------------------------------------------------------------------
                            */}
                            <Table className="">
                                <TableHeader className="">
                                    <TableRow className="">
                                        <TableHead className="min-w-[250px] w-[400px]">Task Name</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[100px]">Assignee</TableHead>
                                        <TableHead className="w-[100px] text-middle">Priority</TableHead>
                                        <TableHead className="w-[100px] text-middle">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {task.sub_tasks.map(subtask => {
                                        return (
                                            <TableRow className="">
                                                <TableCell className="font-medium">{subtask.sub_task_name}</TableCell>
                                                <TableCell>{subtask.status}</TableCell>
                                                <TableCell>{subtask.assignee}</TableCell>
                                                <TableCell className="">{subtask.priority}</TableCell>
                                                <TableCell className="">{subtask.notes}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CollapsibleContent>
                    </Collapsible> 
                )
            })}
        </div>
    </div>
}
