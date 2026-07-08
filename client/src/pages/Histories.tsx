import { Trash } from "lucide-react";
import HistoryList from "../components/HistoryList";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";

export default function Results() {
    const { deleteAllResultsMt, deleteResultMt, getAllResults, isProcessing } = ResultService();
    const { paginatedresult, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = getAllResults;

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="flex flex-col gap-2 w-full md:w-3/4 h-full min-h-50 ">
                <div className="flex justify-end pt-2 pr-2">
                    <button
                        className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        disabled={isProcessing || isLoading}
                        onClick={() => deleteAllResultsMt.mutate()}
                        type="button"
                    >
                        <Trash size={24}/>
                    </button>
                </div>
                {error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-gray-700 text-3xl">{error.message}</div>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : (
                    <HistoryList
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isProcessing={isProcessing}
                        onDelete={deleteResultMt}
                        results={paginatedresult}
                    />
                )}
            </div>
        </section>
    );
}