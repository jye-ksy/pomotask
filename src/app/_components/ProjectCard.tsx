export default function ProjectCard() {

    return <div className="border-solid border-[1px] border-black rounded-md p-4 min-w-[350px] max-w-[350px]">
        <h1 className="font-bold text-md">Project Title</h1>
        <div>
            <p>A project </p>
        </div>
        <div className="mt-4">
            <span className="bg-gray-400 text-white px-2 py-1 rounded-sm">Not Started</span>
        </div>
    </div>
}