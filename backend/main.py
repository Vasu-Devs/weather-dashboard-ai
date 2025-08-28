from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

app=FastAPI()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def suggest(weather_data: str) -> dict:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    json_prompt = f"""
    You are a helpful assistant that gives daily lifestyle suggestions based on weather data.
    Respond **only in JSON format** with exactly these keys:
    {{
        "activity": "<one concise, one-line activity suggestion>",
        "precaution": "<one concise, one-line precaution>",
        "clothing": "<one concise, one-line clothing recommendation>"
    }}

    Make the suggestions **short, clear, and actionable**.
    Here is today's weather data: {weather_data}
    """

    payload = {
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [{"role": "user", "content": json_prompt}],
        "temperature": 0.7
    }

    response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        try:
            content = response.json()["choices"][0]["message"]["content"]
            # Remove markdown code blocks if they exist
            content = re.sub(r"^```json\s*|\s*```$", "", content.strip(), flags=re.MULTILINE)
            return json.loads(content)  # parse cleaned JSON string
        except Exception as e:
            return {"error": f"Failed to parse JSON: {str(e)}", "raw": content}
    else:
        return {"error": f"API error {response.status_code}", "raw": response.text}


origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials =True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/weather/{city}")
def fetch_weather(city: str):
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city.title()}&appid={OPENWEATHER_API_KEY}&units=metric"

    response = requests.get(url)

    if response.status_code==200:
        data=response.json()
        suggestions = suggest(str(data))
        return {"data":data,
                "suggestions":suggestions}
        
    else: 
        return {"error":"could not fetch weather data"}
