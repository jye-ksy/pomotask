"use client";
import { useState } from 'react';
import KanbanLane from './KanbanLane';
import { DndContext, closestCorners, rectIntersection, DragEndEvent} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';


export default function KanbanBoard() {

    const [notStartedItems, setNotStartedItems] = useState([{id: 1, title: "Do a task", status: "Not Started"}]);
    const [inProgressItems, setInProgressItems] = useState([{id: 1, title: "Another task", status: "In Progress"}]);
    const [completedItems, setCompletedItems] = useState([{id: 1, title: "Test task", status: "Completed"}]);







    //Event listener to handle drag and drop
    const handleDragEnd = (event: DragEndEvent) => {

        //Need ot use active and over to compare positioning between two elements
        const {active, over} = event;
        const container = over?.id;
        const title = active.data.current?.title ?? "";
        console.log('current dragged item:', title);
        const index = active.data.current?.index ?? "";
        const parent = active.data.current?.parent ?? "Not Started";

        if (container === "Not Started") {
            setNotStartedItems([...notStartedItems, {title}])
        } else if (container === 'In Progress') {
            setInProgressItems([...inProgressItems, {title}])
        } else {
            setCompletedItems([...completedItems, {title}])
        }
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
    } 


    return (
        // <div className="border border-black max-w-[350px] h-[800px] mx-auto flex flex-col gap-4 p-4">
        //     KanBan
        //     <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        //         {tasks.map(task => (
        //             <TaskCard key={task.id} title={task.title} id={task.id}/>
        //         ))}
        //     </SortableContext>
        // </div>
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <div className='container mx-auto w-full h-full flex gap-4'>
                <KanbanLane title="Not Started" items={notStartedItems}/>
                <KanbanLane title="In Progress" items={inProgressItems}/>
                <KanbanLane title="Completed" items={completedItems}/>
            </div>
        </DndContext>
    )
}