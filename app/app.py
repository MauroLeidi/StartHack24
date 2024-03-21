from flask import Flask, request, jsonify
from flask_cors import CORS
from charting import get_chart_by_layers

app = Flask(__name__)

# Setup CORS
CORS(app, resources={r"/landcover": {"origins": "*"}})

@app.post("/landcover")
def get_map_by_layers():
    request_data = request.get_json()
    if 'layers' not in request_data:
        return jsonify({'error': 'Missing "layers" in request body'}), 400
    layers = request_data['layers']
    print(layers)
    map_html = get_chart_by_layers(layers)
    print("done!")
    return map_html, 200, {'Content-Type': 'text/html'}



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
