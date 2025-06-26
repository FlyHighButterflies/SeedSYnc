function Home() {
    return (
        <div className="flex flex-col w-full items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Welcome to the Dashboard
            </h1>
            <div className="w-full">
                <div className="h-[400px] bg-red-400 w-full flex items-center justify-center text-white font-bold text-2xl">
                    Home Content Block 1
                </div>
                <div className="h-[400px] bg-blue-400 w-full flex items-center justify-center text-white font-bold text-2xl rounded-lg">
                    Home Content Block 2
                </div>
                <div className="h-[400px] bg-yellow-400 w-full flex items-center justify-center text-black font-bold text-2xl rounded-lg">
                    Home Content Block 3
                </div>
            </div>
        </div>
    );
}

export default Home;
