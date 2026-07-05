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

        if (!request.ok) {
            const errorData: any = await request.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || `AI API error: ${request.status}`);
        }

        const response: any = await request.json();            
        const analysisText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!analysisText) throw new Error('No analysis result from AI');

        return { analysis: analysisText };
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error?.message || 'Unknown error';

            if (status === 400) {
                throw new Error(`Invalid request to AI API: ${errorMessage}`);
            } else if (status === 403) {
                throw new Error('AI API key is invalid or expired');
            } else if (status === 429) {
                throw new Error('AI API rate limit exceeded. Please try again later');
            } else if (status >= 500) {
                throw new Error('AI API server error. Please try again later');
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('AI API request timeout. Please try again');
        }

        throw new Error('Failed to analyze image');
    }
}