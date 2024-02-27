import ProjectForm from "~/app/_components/ProjectForm"

export default function ProjectCreate() {

    return <div className="container py-16">
        <h1 className="font-bold text-xl mb-8">Create New Project</h1>
        <div><ProjectForm/></div>
    </div>
}