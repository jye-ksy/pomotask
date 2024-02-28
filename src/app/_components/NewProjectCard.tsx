import Link from 'next/link';


export default function NewProjectCard() {

    return <Link  
            href='/create/project' 
            className="flex justify-center items-center bg-gray-50 drop-shadow-md border-solid border-[1px] border-grey-200 rounded-md p-4 min-w-[350px] max-w-[350px]">
            Add New Project
        </Link>
}