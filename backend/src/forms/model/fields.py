import datetime
import uuid
from decimal import Decimal
from enum import Enum
from typing import List, Literal

from pydantic import BaseModel, Field


class FieldType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    DATE = "date"
    CHECKBOX = "checkbox"
    RADIO = "radio"

class BaseField(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Id of the field")
    type: FieldType = Field(description="Type of field")
    description: str = Field(default="", description="Description of the field")

class BaseInputField(BaseModel):
    id: str = Field(description="Id of the field")
    type: FieldType = Field(description="Type of field")

class TextField(BaseField):
    type: Literal["text"] = "text"
    placeholder: str = Field(default="", description="Placeholder text for the text field")
    max_length: int = Field(default=255, description="Maximum length of the text input")

class TextInputField(BaseInputField):
    type: Literal["text"] = "text"
    value: str = Field(default="", description="Value of the text input")

class NumberField(BaseField):
    type: Literal["number"] = "number"

class NumberInputField(BaseInputField):
    type: Literal["number"] = "number"
    value: Decimal = Field(description="Value of the number input")

class DateField(BaseField):
    type: Literal["date"] = "date"

class DateInputField(BaseInputField):
    type: Literal["date"] = "date"
    value: datetime.date = Field(description="Value of the date input")

class CheckboxField(BaseField):
    type: Literal["checkbox"] = "checkbox"
    options: List[str] = Field(description="List of options for the checkbox")

class CheckboxInputField(BaseInputField):
    type: Literal["checkbox"] = "checkbox"
    values: List[str] = Field(description="List of ids of the selected options")

class RadioField(BaseField):
    type: Literal["radio"] = "radio"
    options: List[str] = Field(description="List of options for the radio")

class RadioInputField(BaseInputField):
    type: Literal["radio"] = "radio"
    value: str = Field(description="Value of the selected option")