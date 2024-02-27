import NewProjectCard from "../_components/NewProjectCard"
import ProjectCard from "../_components/ProjectCard"

export default function Dashboard() {

    return <div className="container py-16">
        <h1 className="font-bold text-xl mb-8">My Projects</h1>
        <div className="container w-full flex flex-col gap-8 md:flex-row md:gap-4 md:flex-wrap">
            <ProjectCard/>
            <ProjectCard/>
            <ProjectCard/>
            <NewProjectCard/>
        </div>
    </div>
}