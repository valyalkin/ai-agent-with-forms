from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt

from src.forms.model.fields import NumberField, NumberInputField
from src.forms.model.human_input import FieldInputRequest

model = ChatOpenAI(
    model="gpt-5-mini",
    temperature=0.1,
    max_tokens=1000,
    timeout=30
    # ... (other params)
)


@tool
def ask_number(question: str) -> str:
    """Ask user for any number with a given question"""

    response = interrupt(
        FieldInputRequest(
            field=NumberField(
                description=question
            )
        )
    )

    number_response = NumberInputField.model_validate(response)

    return f"Number: {number_response.value}"

@tool
def ask_text() -> str:
    """Ask user for any text"""

    text = interrupt("Provide the text")

    return f"Result: {text}"


checkpointer = MemorySaver()

simple_agent = create_agent(
    model=model,
    tools=[ask_number, ask_text],
    system_prompt=f"""
    You are the agent who requires the users to provide the following information:
    
    1. User's name - text
    2. User's age - number
    

    After user has provided all information, summarize it for the user.
    
    You can also be asked to amend information.
    
    Use the appropriate tools to request the user to provide missing information or amend it.
    
    When asked to provide information, ask one by one.
    """,
    checkpointer=checkpointer
)