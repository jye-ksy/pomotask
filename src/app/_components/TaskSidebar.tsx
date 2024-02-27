type SideBarProps = {
    sideBarOpen: boolean;
    toggleSideBar: () => void;
}

import {DoubleArrowRightIcon } from "@radix-ui/react-icons";

export default function TaskSideBar({sideBarOpen, toggleSideBar} : SideBarProps) {
    console.log(sideBarOpen)
    return <div className={`w-[40vw] h-full z-10 fixed top-0 right-0 ${sideBarOpen ? 'translate-x-0' : 'translate-x-full'} ease-in-out duration-500 border-solid border-l-[1px] border-t-[1px] border-black bg-white container p-8`}>
        <DoubleArrowRightIcon width="20" height="20" onClick={toggleSideBar}/>
        
        <h1 className="font-bold text-xl mb-8">New Task</h1>
    </div>

}

