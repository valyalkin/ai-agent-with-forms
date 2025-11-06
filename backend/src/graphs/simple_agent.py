from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt

from src.forms.model.human_input import request_number_input, parse_number_input, request_text_input, \
    parse_text_input, parse_date_input, request_date_input, request_radio_input, parse_radio_input, \
    parse_checkbox_input, request_checkbox_input

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

    provided_number = parse_number_input(
        interrupt(
            request_number_input(
                description=question
            )
        )
    )

    return f"Number: {provided_number}"

@tool
def ask_text(question: str) -> str:
    """Ask user for any text with a given question"""

    provided_text = parse_text_input(
        interrupt(
            request_text_input(
                description=question
            )
        )
    )

    return f"Result: {provided_text}"

@tool
def ask_date(question: str) -> str:
    """Ask user for any date with a given question"""

    provided_text = parse_date_input(
        interrupt(
            request_date_input(
                description=question
            )
        )
    )

    return f"Result: {provided_text}"

@tool
def ask_to_choose_one(question: str, options: list[str]) -> str:
    """Ask user to choose one option from multiple options with a given question"""

    options = request_radio_input(
        description=question,
        options=options
    )

    response = interrupt(options)

    chosen_option = parse_radio_input(response)

    return f"Result: {chosen_option}"


@tool
def ask_to_choose_multiple(question: str, options: list[str]) -> str:
    """Ask user to choose multiple options from multiple options with a given question"""

    options = request_checkbox_input(
        description=question,
        options=options
    )

    response = interrupt(options)

    chosen_option = parse_checkbox_input(response)

    return f"Result: {chosen_option}"

checkpointer = MemorySaver()

# 1. User's name - text
# 2. User's age - number
# 3. Payment method - one of the following: Credit card, Bank account, Cash
# 4.

simple_agent = create_agent(
    model=model,
    tools=[ask_number, ask_text, ask_date, ask_to_choose_one, ask_to_choose_multiple],
    system_prompt=f"""
    You are the agent who requires the users to provide the following information:
    
    1. User's name - text
    2. Oder date - date
    3. Food order - multiple of the following: Burger, Fries, Onion rings, Soda, Cake
    4. Payment method - one of the following: Credit card, Bank account, Cash
    

    After user has provided all information, summarize it for the user.

    You can also be asked to amend information.

    Use the appropriate tools to request the user to provide missing information or amend it.

    When asked to provide information, ask one by one.

    """,
    checkpointer=checkpointer
)