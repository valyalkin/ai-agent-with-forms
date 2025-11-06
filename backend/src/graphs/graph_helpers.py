
def graph_text_input(
        query: str
) -> dict:
    return {"messages": [{"role": "user", "content": query}]}

def session_configuration(
        session_id: str
) -> dict:
    return {"configurable": {"thread_id": session_id}}