'use client';
import { createContext, useState, ReactNode } from "react";

export interface SidebarContextType {
    isOpen: boolean;
    toggleSideBar: () => void;
}

interface SidebarContextProviderProps {
    children: ReactNode; // This makes sure children can be any valid React node
  }


export const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarContextProvider({children}: SidebarContextProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSideBar = () => {
        setIsOpen(prevState => !prevState)
    }

    return (
        <SidebarContext.Provider value={{isOpen, toggleSideBar}}>
        {children}
        </SidebarContext.Provider>
    )
}