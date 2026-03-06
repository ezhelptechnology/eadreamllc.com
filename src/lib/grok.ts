export interface GrokMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function callGrok(messages: GrokMessage[], model: string = 'grok-2-latest'): Promise<string | null> {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
        console.error('GROK_API_KEY not configured');
        return null;
    }

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Grok API error:', errorText);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('Grok call failed:', error);
        return null;
    }
}
