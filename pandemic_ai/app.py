from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

model_path = os.path.join("models", "disease_model.pkl")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model not found at {model_path}")
model = joblib.load(model_path)

HTML_PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hotspot Prediction</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 50%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>Potential Hotspot Areas</h1>
    <form id="csvForm">
        <input type="file" id="csvFile" accept=".csv">
        <button type="submit">Predict Hotspots</button>
    </form>

    <table id="hotspotTable" style="display:none;">
        <thead>
            <tr>
                <th>State</th>
                <th>Region</th>
                <th>Predicted Diseased</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <script>
        const form = document.getElementById('csvForm');
        const table = document.getElementById('hotspotTable');
        const tbody = table.querySelector('tbody');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = document.getElementById('csvFile').files[0];
            if (!file) { alert("Select a CSV file"); return; }

            const text = await file.text();
            const rows = text.split('\\n').filter(r => r.trim() !== '');
            const headers = rows[0].split(',');
            const data = rows.slice(1).map(r => {
                const values = r.split(',');
                let obj = {};
                headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
                return obj;
            });

            try {
                const res = await fetch('/api/predict', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({csvData: data})
                });
                const result = await res.json();
                if(result.error){
                    alert(result.error);
                    table.style.display = 'none';
                } else {
                    tbody.innerHTML = "";
                    result.hotspots.forEach(h => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${h.State}</td><td>${h.Region}</td><td>${h.Predicted_Diseased}</td>`;
                        tbody.appendChild(tr);
                    });
                    table.style.display = 'table';
                }
            } catch (err) {
                alert("Prediction failed: " + err);
                table.style.display = 'none';
            }
        });
    </script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(HTML_PAGE)


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.json.get("csvData")
    if not data or len(data) == 0:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        df = pd.DataFrame(data)
        required_features = ["Population", "Death Rate (%)", "Hospital Admission"]
        for feature in required_features:
            if feature not in df.columns:
                return jsonify({"error": f"Missing column: {feature}"}), 400
        
        X = df[required_features].astype(float)
        df["Predicted_Diseased"] = model.predict(X)
        hotspots = df.sort_values("Predicted_Diseased", ascending=False).head(3)
        return jsonify({
            "hotspots": hotspots[["State", "Region", "Predicted_Diseased"]].to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
