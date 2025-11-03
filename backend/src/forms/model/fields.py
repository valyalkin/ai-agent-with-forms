import datetime
import uuid
from decimal import Decimal
from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class FieldType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    DATE = "date"
    CHECKBOX = "checkbox"
    RADIO = "radio"

class BaseField(BaseModel):
    id: str = Field(default=uuid.uuid4(), description="Id of the field")
    type: FieldType = Field(description="Type of field")
    description: str = Field(default="", description="Description of the field")

class BaseInputField(BaseModel):
    id: str = Field(description="Id of the field")
    type: FieldType = Field(description="Type of field")

class TextField(BaseField):
    type: FieldType = FieldType.TEXT
    placeholder: str = Field(default="", description="Placeholder text for the text field")
    max_length: int = Field(default=255, description="Maximum length of the text input")

class TextInputField(BaseInputField):
    type: FieldType = FieldType.TEXT
    value: str = Field(default="", description="Value of the text input")

class NumberField(BaseField):
    type: FieldType = FieldType.NUMBER

class NumberInputField(BaseInputField):
    type: FieldType = FieldType.NUMBER
    value: Decimal = Field(description="Value of the number input")

class DateField(BaseField):
    type: FieldType = FieldType.DATE

class DateInputField(BaseInputField):
    type: FieldType = FieldType.DATE
    value: datetime.date = Field(description="Value of the date input")

class Option(BaseModel):
    id: str = Field(default=uuid.uuid4(), description="Id of the option")
    label: str = Field(description="Label of the option")

class CheckboxField(BaseField):
    type: FieldType = FieldType.CHECKBOX
    options: List[Option] = Field(description="List of options for the checkbox")

class CheckboxInputField(BaseInputField):
    type: FieldType = FieldType.CHECKBOX
    value: List[str] = Field(description="List of ids of the selected options")

class RadioField(BaseField):
    type: FieldType = FieldType.RADIO
    options: List[Option] = Field(description="List of options for the radio")

class RadioInputField(BaseInputField):
    type: FieldType = FieldType.RADIO
    value: str = Field(description="Id of the selected option")