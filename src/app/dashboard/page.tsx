'use client';
import { useEffect, useState } from 'react';
import NewProjectCard from "../_components/NewProjectCard"
import ProjectCard from "../_components/ProjectCard"
import TaskSideBar from "../_components/TaskSidebar"
import { Button } from '../../components/ui/button';
import { api } from '~/trpc/react';

export default function Dashboard() {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const projects = api.project.getAllProjects.useQuery()


    const toggleSideBar = () => {
        setSideBarOpen(prevState => !prevState)
    }

    if (projects.isLoading) return <div>Loading...</div>

    return (
        <div className="container py-16 relative">
            <h1 className="font-bold text-xl mb-8">My Projects</h1>
            <div className="container w-full flex flex-col gap-8 md:flex-row md:gap-4 md:flex-wrap">
                {projects.data?.map((project) => {
                    console.log(typeof project.id)
                   return <ProjectCard key={project.id} name={project.name} projectId={project.id.toString()} /> 
                })}
                <NewProjectCard/>
                <Button variant="outline" onClick={toggleSideBar}>Add Task</Button>
            </div>
            <TaskSideBar sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar}/>
        </div>
    );

}