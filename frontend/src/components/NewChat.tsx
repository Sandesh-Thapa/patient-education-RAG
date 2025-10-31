import { Image, Mic, Plane, SquarePen } from "lucide-react"

const NewChat = () => {
    return (
        <div className="mx-auto flex w-full flex-col justify-center px-2 pb-2 transition-all duration-700 max-w-3xl flex-1 h-fit mt-16">
            <div className="flex flex-col items-center justify-center pb-4 text-center">
                <h1 className="mb-6 text-3xl font-bold">What can I help with?</h1>
                <div className="grid w-full auto-rows-min gap-4 md:grid-cols-3">
                    <button className="flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-500/10 text-indigo-800 dark:text-indigo-200">
                        <div className="flex items-center gap-2">
                            <SquarePen />
                            <h3 className="font-semibold">Write an invitation</h3>
                        </div>
                        <p className="text-sm opacity-50">Prepare an invitation for an event or a party</p>
                    </button>
                    <button className="flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors bg-red-500/10 hover:bg-red-500/15 border-red-500/10 text-red-800 dark:text-red-200">
                        <div className="flex items-center gap-2">
                            <Image />
                            <h3 className="font-semibold">Create an image</h3>
                        </div>
                        <p className="text-sm opacity-50">Generate an image based on a prompt</p>
                    </button>
                    <button className="flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/10 text-amber-800 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                            <Plane />
                            <h3 className="font-semibold">Plan a trip</h3>
                        </div>
                        <p className="text-sm opacity-50">Find the best time to travel to Tokyo</p>
                    </button>
                </div>
            </div>

            <form className="flex items-end gap-2">
                <div className="relative flex flex-1">
                    <textarea placeholder="Ask anything..." className="focus:ring-brand-foreground bg-accent/50 hover:bg-accent/60 border-border dark:border-border/10 w-full resize-none rounded-lg border p-3 pr-10 focus:ring-2 focus:outline-none" rows={1} style={{minHeight: "100px", maxHeight: "200px"}} />
                    <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow-sm dark:hover:from-primary/80 hover:from-primary/70 dark:hover:to-primary/70 hover:to-primary/90 bg-linear-to-b from-primary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary size-9 absolute right-2 bottom-2 rounded-full">
                        <Mic />    
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NewChat