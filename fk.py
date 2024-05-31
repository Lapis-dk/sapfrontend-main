from flask import Flask, request, jsonify
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import easyocr
from flask_cors import CORS
import os
from collections import defaultdict
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and tokenizer
model = DistilBertForSequenceClassification.from_pretrained('./model')
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-cased')

# Initialize the easyocr reader
reader = easyocr.Reader(['en'])

#Initia;ise listfor count
count_list=[0,0,0]
def classify_sentence(sentence):
    s = sentence.lower()
    inputs = tokenizer(s, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    id_to_category = {0: 'Food', 1: 'Operational Expenses', 2: 'Travel'}
    predicted_category = id_to_category.get(predicted_class, 'Unknown')
    count_list[predicted_class]+=1
    print(count_list)
    return predicted_category

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Handle JSON input (text)
        if request.content_type == 'application/json':
            data = request.json
            if 'text' in data:
                input_text = data['text']
                result = classify_sentence(input_text)
                return jsonify({'prediction': result}), 200
            else:
                return jsonify({'error': 'No text provided'}), 400

        # Handle multipart form input (image)
        elif request.content_type.startswith('multipart/form-data'):
            if 'file' in request.files:
                image_file = request.files['file']
                image_path = os.path.join('/tmp', image_file.filename)
                image_file.save(image_path)
                
                # Perform OCR to extract text from the image
                ocr_results = reader.readtext(image_path, detail=0)
                if ocr_results:
                    input_text = ' '.join(ocr_results)
                    result = classify_sentence(input_text)
                    return jsonify({'prediction': result}), 200
                else:
                    return jsonify({'error': 'No text detected in the image'}), 400
            else:
                return jsonify({'error': 'No file provided'}), 400
        else:
            return jsonify({'error': 'Unsupported Media Type'}), 415
    except Exception as e:
        error_message = 'Prediction error: ' + str(e)
        return jsonify({'error': error_message}), 500

@app.route('/getdata',methods=['POST'])
def get_data():
    data = {
        'labels': ['Food', 'Operational Expenses', 'Travel'],
        'values': count_list
    }
    return jsonify(data)

@app.route('/resetcount', methods=['POST'])
def reset_count():
    global count_list
    count_list = [0, 0, 0]
    return jsonify({'message': 'Count list reset successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)
