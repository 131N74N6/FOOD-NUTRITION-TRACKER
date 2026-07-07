import { GoogleGenAI } from "@google/genai";

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: AI_API_KEY });

const commands = `
Analisis nutrisi apa saja yang terkandung pada makanan atau minuman dalam gambar ini. 
Lalu cantumkan nilai gizi ditiap nutrisi yang ada serta nilai kalorinya. 
Kemudian buat kesimpulan apakah makanan maupun minuman dalam gambar sehat atau tidak. 
Berikan peringatan siapa saja yang tidak boleh mengonsumsi makanan atau minuman dalam gambar. 
Sebutkan dampak yang akan dirasakan tubuh jika mengonsumsi makanan atau minuman dalam gambar secara berlebihan.
`;

export interface GeminiAnalysisResult {
    analysis: string;
}

export interface AnalyzeIntrf {
    imageBuffer: Buffer;
    mimeType: string;
}

export async function analyzeImageWithAI(props: AnalyzeIntrf): Promise<GeminiAnalysisResult> {
    if (!AI_API_KEY) {
        throw new Error('AI_API_KEY is not configured in environment variables');
    }

    if (!ai) {
        throw new Error('GoogleGenAI client is not initialized');
    }

    if (!props.imageBuffer || props.imageBuffer.length === 0) {
        throw new Error('Image buffer is empty');
    }

    try {
        const base64Image = props.imageBuffer.toString('base64');
        const response = await ai.models.generateContent({
            model: AI_MODEL,
            contents: [{
                role: 'user',
                parts: [
                    { text: commands },
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: props.mimeType
                        }
                    }
                ]
            }]
        });

        const analysisText = response.text;

        if (!analysisText || analysisText.trim().length === 0) {
            throw new Error('No analysis result returned from AI. The image might not contain food/drink.');
        }

        return { analysis: analysisText };
    } catch (error: any) {
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
            throw new Error('AI API authentication failed: Invalid API key. Check AI_API_KEY environment variable.');
        }

        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            throw new Error('AI API request timeout. Please try again');
        }

        if (error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('not found')) {
            throw new Error(`AI model '${AI_MODEL}' not found. Check AI_MODEL environment variable.`);
        }

        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('AI API quota exceeded. Please wait a moment and try again.');
        }

        if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
            throw new Error('AI analysis blocked due to safety concerns. Try a different image.');
        }

        if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
            throw new Error('AI analysis timed out. Please try with a smaller image.');
        }

        if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
            throw new Error('Check your internet connection.');
        }

        if (error.message?.includes('PERMISSION_DENIED')) {
            throw new Error('Access denied. Your API key may not have permission to use this model.');
        }

        throw new Error(`AI analysis failed: ${error.message || 'Unknown error'}`);
    }
}