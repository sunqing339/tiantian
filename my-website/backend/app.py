from flask import Flask, request, jsonify
import requests
from config import API_KEY

app = Flask(__name__)

@app.route('/api/proxy-request', methods=['POST'])
def proxy_request():
    data = request.json
    response = requests.get(data['endpoint'], headers={
        'Authorization': f'Bearer {API_KEY}'
    })
    return jsonify(response.json())