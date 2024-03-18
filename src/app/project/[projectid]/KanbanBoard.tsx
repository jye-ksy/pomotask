import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';


interface TaskProps {
    tasks: {
      id: number;
      title: string;
    }[];
  }

export default function KanbanBoard({tasks}: TaskProps) {

    return (
        <div className="border border-black max-w-[350px] h-[800px] mx-auto flex flex-col gap-4 p-4">
            KanBan
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map(task => (
                    <TaskCard key={task.id} title={task.title} id={task.id}/>
                ))}
            </SortableContext>
        </div>
    )
}