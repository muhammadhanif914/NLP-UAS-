import json
from app import app

def test_endpoints():
    print("Starting in-process API tests...")
    client = app.test_client()
    
    # 1. Test /health
    print("\n--- Testing /health ---")
    res = client.get('/health')
    print("Status code:", res.status_code)
    print("Response JSON:", res.get_json())
    assert res.status_code == 200
    
    # 2. Test /api/stats
    print("\n--- Testing /api/stats ---")
    res = client.get('/api/stats')
    print("Status code:", res.status_code)
    data = res.get_json()
    print("Total records in stats:", data.get("total_records"))
    print("Toxicity count:", data.get("counts", {}).get("toxicity"))
    assert res.status_code == 200
    assert "total_records" in data
    
    # 3. Test /api/model-comparison
    print("\n--- Testing /api/model-comparison ---")
    res = client.get('/api/model-comparison')
    print("Status code:", res.status_code)
    data = res.get_json()
    print("IndoBERT accuracy:", data.get("indobert", {}).get("accuracy"))
    print("IndoBERTweet accuracy:", data.get("indobertweet", {}).get("accuracy"))
    assert res.status_code == 200
    assert "indobert" in data
    
    # 4. Test /api/predict
    print("\n--- Testing /api/predict (Toxic Text) ---")
    res = client.post('/api/predict', 
                       data=json.dumps({"text": "Dasar anak babi lu goblok!"}),
                       content_type='application/json')
    print("Status code:", res.status_code)
    data = res.get_json()
    print("Predictions for toxic text:", data)
    assert res.status_code == 200
    assert data["predictions"]["indobert"]["label"] == 1
    assert data["predictions"]["indobertweet"]["label"] == 1
    
    print("\n--- Testing /api/predict (Clean Text) ---")
    res = client.post('/api/predict', 
                       data=json.dumps({"text": "Selamat pagi semuanya, mari kita belajar bersama."}),
                       content_type='application/json')
    print("Status code:", res.status_code)
    data = res.get_json()
    print("Predictions for clean text:", data)
    assert res.status_code == 200
    assert data["predictions"]["indobert"]["label"] == 0
    assert data["predictions"]["indobertweet"]["label"] == 0
    
    print("\nAll in-process API tests passed successfully!")

if __name__ == "__main__":
    test_endpoints()
