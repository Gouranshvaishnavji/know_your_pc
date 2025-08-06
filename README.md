# Custom PC AI Reviewer – AI Agent Learning Project

This project is developed as a hands-on application of the concepts covered in the **"Build Your Own AI Agent"** course. The goal is to build an intelligent, inventory-aware AI system that answers natural language queries related to custom PC configurations and components using structured reasoning, real-time data, and AI-agent design principles.

## Project Objective
To build a single-page AI-driven application that uses a multi-agent architecture to:
- Interpret user prompts
- Generate compatible PC builds from available components
- Compare hardware parts
- Answer detailed component queries
- Use structured outputs and real-time inventory validation

## How Course Concepts Will Be Applied
### Module 1: Foundations of LLMs
- Use Gemini API to power the language capabilities.
- Experiment with prompt structure, temperature, and token limits to optimize generation.
- Deploy the chat interface using local tools (like `aichat`) for early testing.

### Module 2: Prompt Engineering
- Design zero-shot, few-shot, and system prompts for tasks like build generation, part comparison, and explanation.
- Implement prompt testing scripts to evaluate prompt effectiveness and accuracy.
- Automate iteration cycles for prompt refinement.

### Module 3: Structured Outputs & Tool Integration
- Guide AI to return machine-usable formats like JSON for component configurations.
- Build function-calling wrappers to let the AI trigger validation and compatibility checks.
- Design internal tools (e.g., a budget calculator or compatibility validator) that the AI agent can invoke.

### Module 4: Retrieval-Augmented Generation (RAG)
- Store and retrieve product specifications and inventory data using a local vector database.
- Implement semantic search to enrich the agent’s responses with up-to-date, factual data.
- Use RAG pipelines to generate answers from structured product descriptions and documentation.

### Module 5: Designing and Deploying AI Agents
- Use the ReAct framework to build the core AI agent logic.
- Model the **Thought → Action → Observation** cycle to allow step-by-step reasoning for tasks like building a PC within constraints.
- Deploy a modular architecture with separate agents for:
  - Build synthesis
  - Component comparison
  - Inventory validation
  - Prompt simplification

## Expected Outcome
By the end of the project, this system will demonstrate how AI agents can move beyond static chat interfaces to become interactive, logic-driven assistants capable of solving domain-specific problems using reasoning, retrieval, and tool-use.

