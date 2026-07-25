from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model and scaler once, when the server starts
model = joblib.load('risk_model.pkl')
scaler = joblib.load('scaler.pkl')

# The exact feature order used during training - must match!
FEATURE_ORDER = [
    'roa_c',
    'operating_gross_margin',
    'current_ratio',
    'quick_ratio',
    'debt_ratio',
    'net_income_to_total_assets',
    'working_capital_to_total_assets',
]


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'ML scoring service is running'})


@app.route('/score', methods=['POST'])
def score_vendor():
    try:
        data = request.get_json()

        features = [data.get(f, 0) for f in FEATURE_ORDER]
        features_array = np.array(features).reshape(1, -1)

        features_scaled = scaler.transform(features_array)

        risk_probability = model.predict_proba(features_scaled)[0][1]
        risk_score = round(risk_probability * 100, 2)

        # Tiers calibrated against real score distribution:
        # median ~1.3%, 90th percentile ~5.8%, avg bankrupt company ~23%
        if risk_score >= 10:
            risk_tier = 'high'
        elif risk_score >= 3:
            risk_tier = 'medium'
        else:
            risk_tier = 'low'

        return jsonify({
            'risk_score': risk_score,
            'risk_tier': risk_tier,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)