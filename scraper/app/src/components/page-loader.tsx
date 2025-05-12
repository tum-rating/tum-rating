const PageLoader = () => {
    return (
        <div className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl">
            <div className="flex items-center">
                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-6 w-6"/>
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

export default PageLoader;