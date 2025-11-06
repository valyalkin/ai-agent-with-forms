from typing import Union

from pydantic import BaseModel, Field

from src.forms.model.fields import TextInputField, \
    NumberInputField, DateInputField, CheckboxInputField, RadioInputField


class ChatInput(BaseModel):
    query: str = Field(description="Query to be answered")
    session_id: str = Field(description="Id of the chat session")

class ChatFieldInput(BaseModel):
    field: Union[TextInputField, NumberInputField, DateInputField, CheckboxInputField, RadioInputField] = Field(description="Value of the field")
    session_id: str = Field(description="Id of the chat session")