import { SidebarContext, SidebarContextType } from "~/context/SidebarContext";
import { useContext } from "react";

// Custom hook for using SidebarContext with a non-null assertion
 export function useSidebarContext(): SidebarContextType {
    const context = useContext(SidebarContext);
    if (context === null) {
      throw new Error('useSidebarContext must be used within a SidebarContextProvider');
    }
    return context;
  }