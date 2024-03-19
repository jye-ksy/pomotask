'use client';

import { useRouter } from 'next/navigation'
type ProjectCardProps = {
    name: string;
    projectId: string;
}
export default function ProjectCard({name, projectId}:ProjectCardProps) {
    const router = useRouter();

    return <div className="bg-white drop-shadow-md border-solid border-[1px] border-grey-200 rounded-md p-4 min-w-[350px] max-w-[350px] hover:cursor-pointer" onClick={()=> router.push(`/project/${projectId}`)}>
        <h1 className="font-bold text-md">{name}</h1>
        <div>
            <p className="">A project or task </p>
        </div>
        <div className="mt-4">
            <span className="bg-gray-400 text-white px-2 py-1 rounded-sm">Not Started</span>
        </div>
    </div>
}