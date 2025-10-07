from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load CSV
df = pd.read_csv("jobs.csv")  # your updated CSV
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["skills"].astype(str))

# Recommend careers
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    skills = data.get("skills", "")
    if not skills.strip():
        return jsonify({"error": "Please enter skills"}), 400

    user_vec = vectorizer.transform([skills])
    similarity = cosine_similarity(user_vec, tfidf_matrix)
    top_indices = similarity.argsort()[0][-3:][::-1]

    # Use updated column names: role and skills
    recommendations = df.iloc[top_indices][["role", "skills", "upskilling"]].to_dict(orient="records")
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
