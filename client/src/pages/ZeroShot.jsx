import React, { useState } from 'react';

const GEMINI_URI = import.meta.env.VITE_GEMINI_URI;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

// One-shot prompt: instructions + one example
const SYSTEM_PROMPT = `
You are an AI agent working as a seller for custom PC builds.
Your job is to help customers with questions about PC parts and assembling only.
Do not answer questions outside of PC parts or assembly.
Always be friendly and try to recommend builds or compatible parts when possible.

Example:
Customer: Can you tell me about available CPUs?
Agent: Sure! Here are the CPUs we currently have in stock:
- Intel Core i9-13900K: Best for high-end gaming and professional workloads.
- AMD Ryzen 9 7950X: Excellent for multitasking and content creation.
- Intel Core i5-13600K: Great for mid-range gaming and everyday use.
- AMD Ryzen 5 7600X: Good for budget builds and general productivity.

If you tell me your use case, I can recommend the best CPU for you!
`;

const ZeroShot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const url = `${GEMINI_URI}?key=${GEMINI_KEY}`;
      // Combine one-shot prompt and user input
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
      }
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>One-Shot Gemini Prompt</h2>
      {/* This is a one-shot prompt: instructions + one example */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about PC parts or assembly..."
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

export default ZeroShot;