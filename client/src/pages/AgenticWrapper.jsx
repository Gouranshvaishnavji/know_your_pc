import React, { useState } from 'react';

const GEMINI_URI = import.meta.env.VITE_GEMINI_URI;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

// Improved multi-shot prompt: clear role, task, format, and constraints
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

EXAMPLES:

Example 1:
Customer: Can you tell me about available CPUs?
Agent: Certainly! Here are the CPUs we currently have in stock:
- Intel Core i9-13900K: Best for high-end gaming and professional workloads.
- AMD Ryzen 9 7950X: Excellent for multitasking and content creation.
- Intel Core i5-13600K: Great for mid-range gaming and everyday use.
- AMD Ryzen 5 7600X: Good for budget builds and general productivity.
If you let me know your main use case, I can recommend the best CPU for you!

Example 2:
Customer: What keyboards do you have available?
Agent: Absolutely! Here are some keyboards we offer:
- Corsair K95 RGB Platinum: Great for gaming with customizable macros.
- Logitech MX Keys: Excellent for productivity and comfortable typing.
- Razer BlackWidow V4: Perfect for gamers who love mechanical switches.
Let me know your preferences and I can suggest the best keyboard for your needs!

Example 3:
Customer: Which motherboards are in stock?
Agent: Here are the motherboards currently available:
- ASUS ROG Strix Z790-E: Ideal for high-end Intel builds and overclocking.
- MSI MAG B650 Tomahawk: Great for AMD Ryzen systems and gaming.
- Gigabyte B760M DS3H: Good for budget Intel builds.
If you share your CPU choice, I can recommend the most compatible motherboard!
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