import uuid
from enum import Enum
from typing import Union

from pydantic import BaseModel, Field

from src.forms.model.fields import NumberField, TextField, DateField, CheckboxField, RadioField


class InputRequestType(str, Enum):
    FIELD = "field"
    FORM = "form"
    TEXT = "text"

class BaseHumanInputRequest(BaseModel):
    id: str = uuid.uuid4()
    type: InputRequestType = Field(description="Type of input")

class FieldInputRequest(BaseHumanInputRequest):
    type: InputRequestType = InputRequestType.FIELD
    field: Union[TextField, NumberField, DateField, CheckboxField, RadioField]


def build_field_input_request(
        field: Union[TextField, NumberField, DateField, CheckboxField, RadioField]
) -> FieldInputRequest:
    return FieldInputRequest(field=field)
