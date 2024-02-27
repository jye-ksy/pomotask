import Link from 'next/link';


export default function NewProjectCard() {

    return <Link  href='/create/project' className="flex justify-center items-center border-solid border-[1px] border-black rounded-md p-4 min-w-[350px] max-w-[350px]">
        Add New Project
    </Link>
}