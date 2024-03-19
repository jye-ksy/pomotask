"use client";
import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import { DndContext, closestCorners, DragEndEvent} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export default function ProjectPage() {

    const [tasks,setTasks] = useState([
        {id: 1, title: "Do a task", status: "Not Started"}, 
        {id: 2, title: "Another task", status: "In Progress"}, 
        {id: 3, title: "Test task", status: "Completed"}, 
    ])
    
    //Helper function to find the position of an array
    const getTaskPosition = (id : number) => tasks.findIndex(task => task.id === id)


    //Event listener to handle drag and drop
    const handleDragEnd = (event: DragEndEvent) => {

        //Need ot use active and over to compare positioning between two elements
        const {active, over} = event;
        
        //If the active and over id are the same then it means it is at the same place, do nothing
        if(active.id === over.id) return;

        //Update ordering array by using arrayMove to reconstruct ordering
        setTasks(tasks => {
            const originalPost = getTaskPosition(active.id)
            const newPosition = getTaskPosition(over.id);

            return arrayMove(tasks, originalPost, newPosition)
        })
    }

    return (
        <div className="py-16">
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <KanbanBoard tasks={tasks}/>
            </DndContext>
        </div>
    )
}