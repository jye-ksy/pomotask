import { useDraggable } from "@dnd-kit/core";

type TaskProps = {
    id: number;
    name: string;
    index: number;
    parent: string;
}

export default function KanbanCard( {id, name, index, parent}: TaskProps ) {
    const { attributes, listeners, setNodeRef, transform} = useDraggable({
        id: name,
        data: {
            id,
            name, 
            index, 
            parent
        }
    })


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
            {name}
        </div>
    )
}