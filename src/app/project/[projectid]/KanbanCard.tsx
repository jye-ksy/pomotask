import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';

type TaskProps = {
    title: string;
    index: number;
    parent: string;
}

export default function KanbanCard( {title, index, parent}: TaskProps ) {

    const { attributes, listeners, setNodeRef, transform} = useDraggable({
        id: title,
        data: {
            title, 
            index, 
            parent
        }
    })
    // const style = {
    //     transform: CSS.Transform.toString(transform)
    // };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;


    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            className="bg-white border py-2 px-4 rounded-sm"
            >
            {title}
        </div>
    )
}