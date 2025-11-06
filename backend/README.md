# AI Agent with Forms - Backend

A FastAPI backend implementing an AI agent with dynamic form handling using LangChain and LangGraph.

## Requirements

- Python 3.13+
- [uv](https://docs.astral.sh/uv/) package manager

## Setup

1. Install dependencies:
```bash
uv sync
```

2. Set environment variables:
```bash
export OPENAI_API_KEY=your_api_key_here
```

## Run

Start the development server:
```bash
uv run fastapi dev src/main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
