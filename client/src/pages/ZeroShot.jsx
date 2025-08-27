import React, { useState } from 'react';

const GEMINI_URI = import.meta.env.VITE_GEMINI_URI;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

// System prompt: instruct Gemini to act as a PC seller agent
const SYSTEM_PROMPT = `
You are an AI agent working as a seller for custom PC builds. 
Your job is to help customers with questions about PC parts and assembling only. 
Do not answer questions outside of PC parts or assembly. 
Always be friendly and try to recommend builds or compatible parts when possible.
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
      // Combine system prompt and user input for zero-shot instruction
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
      <h2>Zero-Shot Gemini Prompt</h2>
      {/* This is a zero-shot prompt: only instructions, no examples */}
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