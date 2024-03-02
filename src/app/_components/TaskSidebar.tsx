import {DoubleArrowRightIcon } from "@radix-ui/react-icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../components/ui/tooltip";

type SideBarProps = {
    sideBarOpen: boolean;
    toggleSideBar: () => void;
}

export default function TaskSideBar({sideBarOpen, toggleSideBar} : SideBarProps) {
    return (
    <div>
        <div className={ sideBarOpen ? "h-screen w-screen bg-black/80 fixed top-0 left-0" : ""} onClick={toggleSideBar}/>
        <div className={`container p-8 w-[40vw] h-full z-10 fixed top-0 right-0 ${sideBarOpen ? 'translate-x-0' : 'translate-x-full'} ease-in-out duration-500 bg-white drop-shadow-xl`}>

            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DoubleArrowRightIcon width="20" height="20" onClick={toggleSideBar}/>
                </TooltipTrigger>
                <TooltipContent>
                <p>Close Sidebar</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            
            <h1 className="font-bold text-xl mb-8 mt-4">New Task</h1>
        </div>
    </div>
    );

}

