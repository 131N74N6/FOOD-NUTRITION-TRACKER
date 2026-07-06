import { useEffect } from "react";
import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";

export default function Analyze() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    useEffect(() => {
        if (message) {
            const x = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(x);
        }
    }, [message, setMessage])

    const { 
        analyzeMt, 
        fileInputRef, 
        handleSelectedFile, 
        isProcessing, 
        resetResult,
        result,
        selectedImageUrl
    } = ResultService({ setMessage: setMessage });

    const analyzeImage = (event: React.SyntheticEvent) => {
        event.preventDefault();
        analyzeMt.mutate();
    }
    
    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {message ? <Alert message={message}/> : null}
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 flex flex-col gap-2 h-full p-2">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleSelectedFile}/>
                <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-gray-500 h-[30%] text-gray-500">
                    {selectedImageUrl ? (
                        <img src={selectedImageUrl} className="object-cover w-full h-full"/>
                    ) : (
                        <div className="text-gray-500 font-medium flex h-full justify-center items-center">Click here to select your image</div>
                    )}
                </div>
                <div className="border border-gray-600 text-gray-950 font-medium h-full">
                    {result ? (
                        <div className="overflow-y-auto h-[70%]">{result}</div>
                    ) : (
                        <div className="flex justify-center items-center h-full">Result will appear here</div>
                    )}
                </div>
                {result ? (
                    <button 
                        className="disabled:cursor-not-allowed cursor-pointer bg-green-600 hover:bg-green-700 transition-colors p-2 rounded-lg text-[0.88rem] text-white font-medium "
                        disabled={isProcessing}
                        onClick={resetResult} 
                        type="button"
                    >
                        Reset
                    </button>
                ) : (
                    <button 
                        className="disabled:cursor-not-allowed cursor-pointer bg-green-600 hover:bg-green-700 transition-colors p-2 rounded-lg text-[0.88rem] text-white font-medium "
                        disabled={isProcessing}
                        onClick={analyzeImage} 
                        type="submit"
                    >
                        {isProcessing ? 'Analyzing...' : 'Start Analyze'}
                    </button>
                )}
            </div>
        </section>
    );
}