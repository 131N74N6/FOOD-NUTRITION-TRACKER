import type { IResultList } from "../models/result.model";
import HistoryData from "./HistoryData";
import Loading from "./Loading";

export default function HistoryList(props: IResultList) {
    if (props.results.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center font-medium text-gray-700 text-3xl">History not found or has been deleted</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 p-2">
                {props.results.map(result => (
                    <HistoryData
                        isProcessing={props.isProcessing}
                        key={result._id}
                        onDelete={props.onDelete}
                        result={result}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.results.length <= 14 ? (
                    <></>
                ) : props.hasNextPage ? (
                    <button 
                        className="text-gray-700 font-medium disabled:cursor-not-allowed hover:text-gray-800 transition-colors cursor-pointer text-[0.8rem]"
                        disabled={props.isProcessing}
                        onClick={() => props.fetchNextPage()}
                        type="button"
                    >
                        Show More
                    </button>
                ) : props.isFetchingNextPage ? (
                    <Loading/>
                ) : (
                    <div className="text-gray-700 font-medium text-center hover:text-gray-800 transition-colors text-[0.8rem]">No More Data to Show...</div>
                )}
            </div>
        </div>
    );
}