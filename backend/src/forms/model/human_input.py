import datetime
import uuid
from decimal import Decimal
from enum import Enum
from typing import Annotated, Union

from pydantic import BaseModel, Field

from src.forms.model.fields import NumberField, TextField, DateField, CheckboxField, RadioField, NumberInputField, \
    TextInputField, DateInputField, CheckboxInputField, RadioInputField


class InputRequestType(str, Enum):
    FIELD = "field"
    FORM = "form"
    TEXT = "text"

class BaseHumanInputRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: InputRequestType = Field(description="Type of input")

class FieldInputRequest(BaseHumanInputRequest):
    type: InputRequestType = InputRequestType.FIELD
    field: Annotated[Union[TextField, NumberField, DateField, CheckboxField, RadioField], Field(discriminator='type')]


def request_number_input(description: str) -> FieldInputRequest:
    return FieldInputRequest(
            field=NumberField(
                description=description
            )
        )

def parse_number_input(response: str) -> Decimal:
    try:
        number_response = NumberInputField.model_validate(response)
        return number_response.value
    except Exception as e:
        raise ValueError(f"Invalid number input: {e}")

def request_text_input(
        description: str,
        placeholder: str = "",
        max_length: int = 255
) -> FieldInputRequest:
    return FieldInputRequest(
        field=TextField(
            description=description,
            placeholder=placeholder,
            max_length=max_length
        )
    )

def parse_text_input(response: str) -> str:
    try:
        text_response = TextInputField.model_validate(response)
        print(response)
        return text_response.value
    except Exception as e:
        raise ValueError(f"Invalid text input: {e}")

def request_date_input(description: str) -> FieldInputRequest:
    return FieldInputRequest(
        field=DateField(
            description=description
        )
    )

def parse_date_input(response: str) -> datetime.date:
    try:
        date_response = DateInputField.model_validate(response)
        return date_response.value
    except Exception as e:
        raise ValueError(f"Invalid date input: {e}")

def request_checkbox_input(description: str, options: list[str]) -> FieldInputRequest:

    return FieldInputRequest(
        field=CheckboxField(
            description=description,
            options=options
        )
    )

def parse_checkbox_input(response: str) -> list[str]:
    try:
        checkbox_response = CheckboxInputField.model_validate(response)
        return checkbox_response.values
    except Exception as e:
        raise ValueError(f"Invalid checkbox input: {e}")


def request_radio_input(description: str, options: list[str]) -> FieldInputRequest:

    return FieldInputRequest(
        field=RadioField(
            description=description,
            options=options
        )
    )

def parse_radio_input(response: str) -> str:
    try:
        radio_response = RadioInputField.model_validate(response)
        return radio_response.value
    except Exception as e:
        raise ValueError(f"Invalid radio input: {e}")