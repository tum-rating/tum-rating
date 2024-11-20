import AppLayout from "@/components/layout/app-layout.tsx";
import { AppDataProvider } from "@/context/app-data-context.tsx";
import MainPage from "@/views/MainPage.tsx";
import { Suspense } from "react";
import PageLoader from "@/components/page-loader.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import UserSetupDialog from "@/components/user-setup-dialog.tsx";

function App() {
    return (
        <AppDataProvider>
            <TooltipProvider>
                <UserSetupDialog />
                <AppLayout>
                    <Suspense fallback={<PageLoader />}>
                        <MainPage />
                    </Suspense>
                </AppLayout>
            </TooltipProvider>
        </AppDataProvider>
    );
}

export default App;