const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

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

export async function analyzeImageWithAI(imageBuffer: Buffer, mimeType: string): Promise<GeminiAnalysisResult> {
    if (!AI_API_KEY) throw new Error('AI Api Key is not configured');

    try {
        const base64Image = imageBuffer.toString('base64');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`;

        const request = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: commands }, 
                        { inline_data: { 
                            data: base64Image, 
                            mime_type: mimeType 
                        }}
                    ]
                }]
            }),
            method: 'POST'
        });

        const response: any = await request.json().catch(() => ({}));

        if (!request.ok) {
            const errorMessage = response?.error?.message || `AI API error: ${response.status}`;

            if (request.status === 400) {
                throw new Error(`Invalid request to AI API: ${errorMessage}`);
            } else if (request.status === 403) {
                throw new Error('AI API key is invalid or expired');
            } else if (request.status === 429) {
                throw new Error('AI API rate limit exceeded. Please try again later');
            } else if (request.status >= 500) {
                throw new Error('AI API server error. Please try again later');
            }
        }

        const analysisText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!analysisText) throw new Error('No analysis result from AI');

        return { analysis: analysisText };
    } catch (error: any) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            throw new Error('AI API request timeout. Please try again');
        }

        if (error.cause?.code === 'ECONNREFUSED' || error.cause?.code === 'ENOTFOUND') {
            throw new Error('Cannot connect to AI API. Check your internet connection');
        }

        throw new Error('Failed to analyze image');
    }
}