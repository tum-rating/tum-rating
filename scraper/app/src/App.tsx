import AppLayout from "@/components/layout/app-layout.tsx";
import {AppDataProvider} from "@/context/app-data-context.tsx";
import MainPage from "@/views/MainPage.tsx";
import {Suspense} from "react";
import PageLoader from "@/components/page-loader.tsx";

function App() {
    return (
        <AppDataProvider>
            <AppLayout>
                <Suspense fallback={<PageLoader/>}/>
                <MainPage/>
            </AppLayout>
        </AppDataProvider>
    )
}

export default App
