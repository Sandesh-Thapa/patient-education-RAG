"use client"
import ToggleTheme from "./ToggleTheme";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

const Navbar = ({chatTitle}: {chatTitle?:string}) => {
    const { open } = useSidebar()
    return(
        <header className="bg-background/50 sticky top-0 z-10 pl-2 flex h-16 w-full shrink-0 justify-between items-center gap-2 px-4 backdrop-blur-lg dark:bg-transparent">
            <div className="flex items-center">
                {!open && <SidebarTrigger />}
                {chatTitle && <h2 className="truncate font-semibold dark:drop-shadow">{chatTitle}</h2>}
            </div>
            <ToggleTheme />
        </header>
    )
}

export default Navbar;