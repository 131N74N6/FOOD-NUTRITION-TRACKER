import HistoryList from "../components/HistoryList";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";

export default function Results() {
    const { deleteResultMt, getAllResults, isProcessing } = ResultService();
    const { paginatedresult, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = getAllResults;

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 h-full overflow-y-auto">
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