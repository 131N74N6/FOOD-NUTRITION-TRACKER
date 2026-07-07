import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";
import Loading from "../components/Loading";
import { useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Details() {
    const { _id } = useParams();
    const { getResult, isProcessing } = ResultService({ id: _id! });
    const { resultDetail, detailError, isDetailLoading } = getResult;

    const sanitizedAnswer = useMemo(() => {
        if (!resultDetail) return;
        return DOMPurify.sanitize(resultDetail[0].explanation, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'
            ],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [_id, resultDetail?.[0].explanation]);

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 h-full overflow-y-auto p-2">
                {detailError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-gray-700 text-3xl">{detailError.message}</div>
                    </div>
                ) : isDetailLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-500 font-medium">{new Date(resultDetail?.[0].created_at!).toLocaleString()}</div>
                        <div className="w-full xl:h-120 lg:h-100 md:h-80 sm:h-60 h-40">
                            <img src={resultDetail?.[0].image.url} alt={resultDetail?.[0].image.public_id} className="w-full h-full object-cover"/>
                        </div>
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
                )}
            </div>
        </section>
    );
}