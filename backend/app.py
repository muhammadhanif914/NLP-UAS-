import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import ModelLoader
from stats_analyzer import StatsAnalyzer

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Initialize modules
print("Initializing model loader...")
model_loader = ModelLoader()

print("Initializing stats analyzer...")
stats_analyzer = StatsAnalyzer()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "models": {
            "indobert": "loaded" if model_loader.indobert_model else "mock",
            "indobertweet": "loaded" if model_loader.indobertweet_model else "mock"
        }
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' parameter in request body"}), 400
        
    text = data['text']
    result = model_loader.predict(text)
    
    return jsonify({
        "text": text,
        "predictions": result
    })

@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify(stats_analyzer.get_stats())

@app.route('/api/model-comparison', methods=['GET'])
def model_comparison():
    return jsonify(stats_analyzer.get_metrics())

if __name__ == '__main__':
    # Run Flask app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
