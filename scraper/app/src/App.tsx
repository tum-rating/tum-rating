import AppLayout from "@/components/layout/app-layout.tsx";
import {AppDataProvider} from "@/context/app-data-context.tsx";
import MainPage from "@/views/MainPage.tsx";
import {Suspense} from "react";
import PageLoader from "@/components/page-loader.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

function App() {
    return (
        <AppDataProvider>
            <TooltipProvider>
                <AppLayout>
                    <Suspense fallback={<PageLoader/>}/>
                    <MainPage/>
                </AppLayout>
            </TooltipProvider>
        </AppDataProvider>
    )
}

export default App
