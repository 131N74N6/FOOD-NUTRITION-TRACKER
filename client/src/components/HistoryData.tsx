import remarkGfm from "remark-gfm";
import type { IResultData } from "../models/result.model";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";
import { useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryData(props: IResultData) {
    const navigate = useNavigate();

    const sanitizedAnswer = useMemo(() => {
        if (!props.result.explanation) return;
        return DOMPurify.sanitize(props.result.explanation, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [props.result._id, props.result.explanation]);

    return (
        <div className="flex flex-col gap-2 p-2 rounded-lg border border-gray-600">
            <div>Created at: {new Date(props.result.created_at).toLocaleString()}</div>
            <div className="h-40 w-full">
                <img src={props.result.image.url} alt={props.result.image.public_id} className="w-full h-full object-cover"/>
            </div>
            <div className="md:line-clamp-4 line-clamp-3">
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
            <div className="flex gap-2">
                <button
                    className="disabled:cursor-not-allowed cursor-pointer text-gray-900 hover:text-gray-700 transition-colors text-[0.8rem]"
                    disabled={props.isProcessing}
                    onClick={() => props.onDelete.mutate(props.result._id)}
                    type="button"
                >
                    <Trash2 size={24}/>
                </button>
                <button
                    className="disabled:cursor-not-allowed cursor-pointer text-gray-900 hover:text-gray-700 transition-colors text-[0.8rem]"
                    disabled={props.isProcessing}
                    onClick={() => navigate(`/result/${props.result._id}`)}
                    type="button"
                >
                    <Eye size={24}/>
                </button>
            </div>
        </div>
    );
}