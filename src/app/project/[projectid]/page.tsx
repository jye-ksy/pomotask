'use client';

import { api } from "~/trpc/react"
import { useRouter } from 'next/router';

type paramsType = {
    projectid: string;
}
export default function ProjectPage({ params }: { params: paramsType }) {
    const { projectid } = params;    
    const project = api.project.getProjectById.useQuery({id: projectid});

    if (!project.data) {
        // Handle loading state or null data, e.g., show a loading spinner or a message
        return <div>Loading...</div>;
    }

    const { id, name} = project.data


    return <div className="container py-16">
        <h1 className="font-bold text-xl">{name}</h1>
    </div>
}