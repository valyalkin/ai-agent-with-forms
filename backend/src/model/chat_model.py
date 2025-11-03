from pydantic import BaseModel, Field


class ChatInput(BaseModel):
    query: str = Field(description="Query to be answered")
    session_id: str = Field(description="Id of the chat session")