import { useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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

    const sanitizedAnswer = useMemo(() => {
        if (!result) return;
        return DOMPurify.sanitize(result, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [result]);
    
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
                <div className="border border-gray-600 text-gray-950 font-medium h-[62.4%]">
                    {result ? (
                        <div className="overflow-y-auto h-full p-2">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ node, ...props }) => <p className="text-gray-900 leading-relaxed" { ...props }></p>,
                                    ul: ({ node, ...props }) => <ul className="text-gray-900 list-disc pl-5 my-2 space-y-1" { ...props }></ul>,
                                    ol: ({ node, ...props }) => <ol className="text-gray-900 list-decimal pl-5 my-2 space-y-1" { ...props }></ol>,
                                    li: ({ node, ...props }) => <li className="text-gray-900" { ...props }></li>,
                                    strong: ({ node, ...props }) => <strong className="text-gray-900 font-semibold" { ...props }></strong>,
                                    em: ({ node, ...props }) => <em className="text-gray-900 italic" { ...props }></em>,
                                    code: ({ node, inline, className, children, ...props }: any) => 
                                        inline ? (
                                            <code className="bg-gray-800 text-yellow-300 px-1 py-0.5 rounded text-sm" { ...props }>
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-gray-900 text-violet-500 rounded p-3 overflow-x-auto my-3">
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                        ),
                                    blockquote: ({ node, ...props }) => <blockquote className="bg-gray-400 text-black border-l-4 border-gray-800 italic my-3" { ...props }></blockquote>,
                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2" { ...props }></h1>,
                                    h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2" { ...props }></h2>,
                                    h3: ({ node, ...props }) => <h3 className="text-base font-medium text-gray-900 mt-2 mb-1" { ...props }></h3>
                                }}
                            >
                                {sanitizedAnswer}
                            </ReactMarkdown>
                        </div>
                    ) : isProcessing ? (
                        <div className="flex justify-center items-center h-full">Processing...</div>
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