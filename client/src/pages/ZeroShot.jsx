import React, { useState } from 'react';

const GEMINI_URI = import.meta.env.VITE_GEMINI_URI;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

const ZeroShot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
        console.log('GEMINI_URI:', GEMINI_URI);
      const url = `${GEMINI_URI}?key=${GEMINI_KEY}`;
      console.log('Request URL:', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: input }],
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything..."
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