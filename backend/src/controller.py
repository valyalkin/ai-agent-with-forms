from fastapi import APIRouter
from langgraph.types import Command

from src.graphs.graph_helpers import graph_text_input, session_configuration
from src.graphs.simple_agent import simple_agent
from src.model.chat_model import ChatInput, ChatFieldInput
from rich import print
router = APIRouter()

@router.post("/agent/simple/chat")
async def chat(chat_input: ChatInput):
    return await simple_agent.ainvoke(
        input = graph_text_input(chat_input.query),
        config = session_configuration(chat_input.session_id)
    )

@router.post("/agent/simple/chat/resume/field")
async def chat(field_input: ChatFieldInput):
    print(field_input)
    return await simple_agent.ainvoke(
        input = Command(resume=field_input.field.model_dump()),
        config = session_configuration(field_input.session_id)
    )