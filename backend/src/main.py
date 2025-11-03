from fastapi import FastAPI

from src.graphs.simple_agent import simple_agent
from src.model.chat_model import ChatInput
from rich import print

app = FastAPI()

@app.post("/chat/simple")
async def chat(chat_input: ChatInput):

    answer = await simple_agent.ainvoke(
        input = {
            "messages": [
                {"role": "user", "content": chat_input.query}
            ]
        },
        config = {
            "configurable": {
                "thread_id": chat_input.session_id
            }
        }
    )

    print(answer)
    return answer


