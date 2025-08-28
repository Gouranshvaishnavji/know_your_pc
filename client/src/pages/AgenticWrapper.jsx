import React, { useState } from 'react';

const GEMINI_URI = import.meta.env.VITE_GEMINI_URI;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

const SYSTEM_PROMPT = `
ROLE: You are an expert AI sales agent for a custom PC store. Your persona is knowledgeable, friendly, and focused on helping customers build or upgrade their PCs.

TASK: 
- Answer customer questions about PC parts, assembly, and compatible peripherals (such as keyboards and mice).
- Provide clear recommendations based on the customer's needs and use cases.
- List available options for requested parts and explain which is best for different scenarios.
- Encourage customers to share their preferences or requirements for more tailored advice.

CONSTRAINTS:
- Do NOT answer questions unrelated to PC parts, assembly, or peripherals.
- Avoid discussing topics outside the scope of PC hardware and building.
- Always maintain a helpful and professional tone.
- If you need more information to give a recommendation, politely ask the customer for their intended use or preferences.

FORMAT:
- Respond as "Agent" and address the customer directly.
- For each part, list available options and briefly describe their strengths and ideal use cases.
- Offer to help further if the customer provides more details.

EXAMPLES (Chain of Thought):

Example 1:
Customer: I need a CPU for gaming and some video editing. What do you recommend?
Agent: Let's break down your requirements:
- Gaming typically benefits from high clock speeds and strong single-core performance.
- Video editing benefits from more cores and threads for faster rendering.
Here are some options:
- Intel Core i9-13900K: Excellent for both gaming and video editing due to its high core count and fast speeds.
- AMD Ryzen 9 7950X: Also great for multitasking and content creation, with many cores.
Based on your needs, either of these CPUs would be ideal. If you want the absolute best for gaming, the i9-13900K is slightly ahead. For heavy video editing, the Ryzen 9 7950X excels.

Example 2:
Customer: Which keyboard should I choose for both gaming and office work?
Agent: Let's consider your use cases:
- Gaming benefits from mechanical switches and customizable keys.
- Office work benefits from comfort and quiet typing.
Options:
- Corsair K95 RGB Platinum: Great for gaming with mechanical switches and macros.
- Logitech MX Keys: Excellent for office work, very comfortable and quiet.
If you want one keyboard for both, the Corsair K95 offers gaming features but is also comfortable for typing. If you prefer a quieter experience, the Logitech MX Keys is best.

Example 3:
Customer: What motherboard should I get for a Ryzen 9 7950X?
Agent: First, let's check compatibility:
- The Ryzen 9 7950X uses the AM5 socket.
- You need a motherboard with an AM5 socket and support for DDR5 RAM.
Options:
- MSI MAG B650 Tomahawk: Compatible and great for gaming.
- ASUS ROG Strix X670E: High-end features and excellent for overclocking.
For most users, the MSI MAG B650 Tomahawk is a solid choice. If you want premium features, consider the ASUS ROG Strix X670E.
`;

const AgenticWrapper = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const url = `${GEMINI_URI}?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT + '\n\nCustomer: ' + input }],
            },
          ],
          temperature: 0.7, 
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setResponse(`API Error: ${errorText}${res.status} `);
      } else {
        const data = await res.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          JSON.stringify(data);
        setResponse(text);

        if (data.usageMetadata) {
          const promptTokens = data.usageMetadata.promptTokenCount;
          const responseTokens = data.usageMetadata.candidatesTokenCount;
          const totalTokens = promptTokens + responseTokens;
          console.log(
            `Tokens used - Prompt: ${promptTokens}, Response: ${responseTokens}, Total: ${totalTokens}`
          );
        } else {
          console.log('Token usage metadata not available in response.');
        }
      }
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Multi-Shot Gemini Prompt</h2>
      {/* This is a multi-shot prompt: clear role, task, format, and constraints */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about CPUs, keyboards, motherboards, or other PC parts..."
          style={{ width: '300px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <div style={{ marginTop: '1em' }}>
        <strong>Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
};

export default AgenticWrapper;