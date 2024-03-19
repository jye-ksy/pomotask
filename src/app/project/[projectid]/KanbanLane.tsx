import { useDroppable } from "@dnd-kit/core"
import KanbanCard from "./KanbanCard";

interface TaskProps {
    title: string;
    items: {
      id: number;
      title: string;
      status: string;
    }[];
  }

  interface KanbanLaneProps {
    title: string;
  }

export default function KanbanLane({title, items}: TaskProps) {
    const { setNodeRef } = useDroppable({
        id: title
    })

    return (
        <div>
            <h1 className="font-bold text-md mb-4">{title}</h1>
            <div ref={setNodeRef} className="flex flex-col min-w-[400px] min-h-[50px] p-4 bg-gray-50 drop-shadow-md border-solid border-[1px] border-grey-200 rounded-md">
                <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                        <KanbanCard key={index} title={item.title} index={index} parent={title}/>
                    ))}
                </div>
            </div>
        </div>

    )
}