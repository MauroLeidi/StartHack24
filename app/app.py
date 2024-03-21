from flask import Flask, request, jsonify
from flask_cors import CORS
from charting import get_landcover_by_years

app = Flask(__name__)

# Setup CORS
CORS(app, resources={r"/landcover": {"origins": "*"}})

@app.post("/landcover")
def get_landcover():
    # Flask uses 'request.get_json()' to parse the JSON body of the request
    request_data = request.get_json()

    # Validate the request data
    if 'years' not in request_data:
        return jsonify({'error': 'Missing "years" in request body'}), 400

    years = request_data['years']

    # Assuming 'get_landcover_by_years' returns an HTML string
    map_html = get_landcover_by_years(years)

    # Return the HTML response
    return map_html, 200, {'Content-Type': 'text/html'}

# also create endpoint for a single year, year should be a url parameter and not in the body
@app.get("/landcover/<year>")
def get_landcover_single_year(year):
    map_html = get_landcover_by_years([year])
    return map_html, 200, {'Content-Type': 'text/html'}



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
