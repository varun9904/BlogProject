import os
import nltk
import re
import joblib

from fastapi import FastAPI
from pydantic import BaseModel
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from fastapi.middleware.cors import CORSMiddleware

# === Setup NLTK ===
nltk_data_dir = os.path.join(os.getcwd(), "nltk_data")
os.makedirs(nltk_data_dir, exist_ok=True)

if nltk_data_dir not in nltk.data.path:
    nltk.data.path.append(nltk_data_dir)

for pkg in ["stopwords", "punkt", "wordnet", "omw-1.4"]:
    try:
        nltk.data.find(f"corpora/{pkg}")
    except LookupError:
        nltk.download(pkg, download_dir=nltk_data_dir)

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r'@\w+|\#', "", text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    filtered = [word for word in tokens if word not in stop_words]
    return " ".join(filtered)

model = joblib.load("best_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://blog-project-opal-six.vercel.app"],  
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"msg": "Hate classification API is live 🎯"}

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict_text(request: TextRequest):
    raw_text = request.text
    processed_text = clean_text(raw_text)
    
    input_vector = vectorizer.transform([processed_text])
    predicted_label = model.predict(input_vector)[0]
    predicted_probabilities = model.predict_proba(input_vector)[0]
    
    prediction_text = "Hate Speech" if predicted_label == 1 else "Safe Speech"
    
    return {
        "cleaned_text": processed_text,
        "prediction": prediction_text,
        "probabilities": {
            "safe": float(predicted_probabilities[0]),
            "hate": float(predicted_probabilities[1])
        }
    }
