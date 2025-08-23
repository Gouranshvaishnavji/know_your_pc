# CustomPC World AI Wrapper

This repository contains the source code for an AI-powered assistant designed to help users explore, understand, and order custom PC builds from CustomPC World. The wrapper integrates the Gemini API with a structured PC parts database to provide accurate, inventory-aware, and rule-compliant responses.

## Project Goal

Build an intelligent, conversational assistant that guides users through the complex process of building a custom PC. The AI answers natural language queries, suggests compatible builds based on available inventory, and enforces business rules, streamlining the path from discovery to purchase.

## Core Features & Implementation

### 1. Natural Language PC Part Queries

Users can ask general questions about PC parts or builds in plain English. The AI parses the query and returns structured data from the database.

**Implementation:**  
The Express backend receives a user query, validates it with Zod, and sends a structured prompt to the Gemini API containing database context. The AI's response is parsed and returned as clean JSON for the frontend.

**Tools:** React, Express, Zod, Gemini API

```
// Example Express Route
app.post('/api/query', validate(querySchema), async (req, res) => {
  const { userQuery } = req.body;
  const aiResponse = await aiService.getBuildFromQuery(userQuery);
  res.json(aiResponse);
});
```

---

### 2. "Dream Build" Suggestions

The assistant generates complete, optimized PC builds around a specific component requested by the user, ensuring all suggested parts are in stock.

**Implementation:**  
When a user requests a build (e.g., "Make me a dream PC with an RTX 4090"), the backend fetches available components from a Postgres database and provides them as context to the AI. The AI's suggested build is cross-referenced with the database to guarantee availability.

**Tools:** Drizzle ORM, Postgres, Gemini API

```
// Example Drizzle ORM Query
async function getAvailableParts(category) {
  return await db.select()
    .from(products)
    .where(and(eq(products.category, category), eq(products.inStock, true)));
}
```

---

### 3. Business Logic & Rule Enforcement

AI responses regarding shipping, warranty, and return policies are strictly governed by a predefined knowledge base, preventing hallucinations and ensuring consistency.

**Implementation:**  
A static JSON or Markdown file contains all business rules. This knowledge base is injected into every Gemini prompt as a system-level context.

**Tools:** Static JSON Knowledge Base, Context Injection

```
// Example Prompt Construction
function buildPrompt(userQuestion, rules) {
  const systemContext = `You must answer based ONLY on these rules: ${rules}`;
  const fullPrompt = `${systemContext}\n\nUser Question: ${userQuestion}`;
  return fullPrompt;
}
```

---

### 4. Real-time Compatibility Checks

A dedicated backend service validates the compatibility of AI-suggested part combinations against database constraints.

**Implementation:**  
The database schema includes compatibility constraints (e.g., CPU socket, RAM type). After the AI generates a build, a backend service performs checks and corrects suggestions if needed.

**Tools:** Drizzle Schema, Backend Compatibility Service

```
// Example Compatibility Logic
function checkCompatibility(build) {
  const cpu = build.parts.cpu;
  const ram = build.parts.ram;
  if (cpu.ramType !== ram.ddrType) {
    return { compatible: false, reason: 'CPU and RAM DDR types do not match.' };
  }
  return { compatible: true };
}
```

---

### 5. Seamless Add-to-Cart Integration

Users can directly add an AI-suggested build to their shopping cart, connecting the conversational experience to the e-commerce workflow.

**Implementation:**  
Once a build is finalized, an Express route formats the list of parts into the cart_item schema and saves it to the database, linked to the user's session via a JWT stored in a cookie.

**Tools:** Express, Postgres, JWT

```
// Example Add-to-Cart Route
app.post('/api/cart', authenticateUser, async (req, res) => {
  const { buildParts } = req.body;
  const cart = await cartService.createCart(req.user.id, buildParts);
  res.status(201).json(cart);
});
```

---

## Project Structure

```
custompc-ai-wrapper/
├── frontend/
│   ├── components/      # Search bar, Result cards, Cart UI
│   └── pages/           # Home, Results, Cart
├── backend/
│   ├── domain/          # AI logic, prompt templates, validators
│   ├── infrastructure/  # Drizzle schema (products, rules, cart)
│   ├── repository/      # DB queries (getParts, saveCart, etc.)
│   ├── services/        # Compatibility checker, cart builder
│   └── presentation/    # Routes, controllers
├── knowledge_base/      # JSON/Markdown with ordering rules
├── tests/               # Jest + Supertest for AI & DB logic
└── README.md
```

---

## Development Roadmap

- **MVP:** Implement core query functionality. User can ask about PC parts, and AI provides a structured response.
- **Phase 2:** Introduce "Dream Build" suggestions and backend compatibility checker.
- **Phase 3:** Integrate business rules knowledge base for policy-related questions.
- **Phase 4:** Build "Add to Cart" flow with user session management.

---

## Future Enhancements

- **RAG Pipeline:** Transition from simple context injection to a full Retrieval-Augmented Generation (RAG) pipeline for robust AI grounding.