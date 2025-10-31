"use client"
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

const Navbar = () => {
    const { open } = useSidebar()
    return(
        <header className="bg-background/50 sticky top-0 z-10 pl-2 flex h-16 w-full shrink-0 items-center gap-2 px-4 backdrop-blur-lg dark:bg-transparent">
            {!open && <SidebarTrigger />}
            <h2 className="truncate font-semibold dark:drop-shadow">New chat</h2>
        </header>
    )
}

export default Navbar;