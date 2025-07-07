import re
import os
import json
import lmstudio as lms
from .models import ContextEntry, Category

# Pick up your LMStudio model from env or default to the small-chat you loaded
MODEL_ID = os.getenv("LMSTUDIO_MODEL", "small-chat")
chat_model = lms.llm(MODEL_ID)


def generate_task_suggestions(data: dict) -> dict:
    """
    data keys:
      - title: str
      - description: str
      - category_id: int (optional)
      - context_entry_ids: list[int] (optional)

    Returns a dict with:
      priority_score, deadline, categories, enhanced_description
    """

    # 1) Resolve the category name if provided
    cat_name = None
    if data.get("category_id"):
        try:
            cat_name = Category.objects.get(id=data["category_id"]).name
        except Category.DoesNotExist:
            cat_name = None

    # 2) Fetch any context entries
    context_texts = []
    for cid in data.get("context_entry_ids", []):
        try:
            e = ContextEntry.objects.get(id=cid)
            context_texts.append(f"[{e.source_type}@{e.timestamp}]\n{e.content}")
        except ContextEntry.DoesNotExist:
            pass
    context_block = "\n\n".join(context_texts) or "No additional context."

    # 3) Build a strict JSON-only prompt
    prompt = f"""
You are an AI assistant for task management.
Output exactly ONE valid JSON object and NOTHING else.
It must contain:
  - priority_score (0.0–1.0)
  - deadline (ISO-8601)
  - categories (array of 1–3 strings)
  - enhanced_description (string)

Title:       {data['title']}
Description: {data['description']}
Category:    {cat_name or "None"}

Context:
{context_block}

pgsql
Copy
Edit
Respond **only** with JSON.
""".strip()

    prediction = chat_model.respond(prompt)

    # unwrap text
    if hasattr(prediction, "text"):
        raw = prediction.text
    elif hasattr(prediction, "response"):
        raw = prediction.response
    else:
        raw = str(prediction)

    raw_clean = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()

    # now grab the JSON between the first { and last }
    try:
        start = raw_clean.index("{")
        end   = raw_clean.rindex("}") + 1
        jstr  = raw_clean[start:end]
        parsed = json.loads(jstr)

        return {
            "priority_score":       float(parsed["priority_score"]),
            "deadline":             parsed["deadline"],
            "categories":           list(parsed.get("categories", [])),
            "enhanced_description": str(parsed["enhanced_description"]),
        }

    except Exception:
        # Fallback stub
        return {
            "priority_score":       0.5,
            "deadline":             "2025-07-10T12:00:00Z",
            "categories":           ["General"],
            "enhanced_description": (
                "Fallback stub: AI did not return valid JSON.\n"
                f"Raw output was:\n{raw_clean[:200]}"
            ),
        }