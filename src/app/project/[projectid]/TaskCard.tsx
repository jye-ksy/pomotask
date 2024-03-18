import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities';

type TaskProps = {
    id: number;
    title: string;
}

export default function TaskCard( {id, title}: TaskProps ) {

    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({id})
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };


    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            className="bg-gray-100 py-2 px-4 rounded-sm">
            {title}
        </div>
    )
}