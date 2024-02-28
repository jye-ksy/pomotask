'use client';
import { useState } from 'react';
import NewProjectCard from "../_components/NewProjectCard"
import ProjectCard from "../_components/ProjectCard"
import TaskSideBar from "../_components/TaskSidebar"
import { Button } from '../../components/ui/button';

export default function Dashboard() {
    const [sideBarOpen, setSideBarOpen] = useState(false);

    const toggleSideBar = () => {
        setSideBarOpen(prevState => !prevState)
    }
    return (
        <div className="container py-16 relative">
            <h1 className="font-bold text-xl mb-8">My Projects</h1>
            <div className="container w-full flex flex-col gap-8 md:flex-row md:gap-4 md:flex-wrap">
                <ProjectCard/>
                <ProjectCard/>
                <ProjectCard/>
                <NewProjectCard/>
                <Button variant="outline" onClick={toggleSideBar}>Add Task</Button>
            </div>
            <TaskSideBar sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar}/>
        </div>
    );

}