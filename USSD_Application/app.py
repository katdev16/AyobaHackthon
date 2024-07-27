from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)





# AYOBA_API_URL= "https://api.ayoba.me/v1/business/message"

#AYOBA_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ijk5MjlhODViMWI1ZWMxYWIwMDQ2M2Y1OGJjM2I4MmE0NWNlODUyZTQiLCJqaWQiOiI5OTI5YTg1YjFiNWVjMWFiMDA0NjNmNThiYzNiODJhNDVjZTg1MmU0QGF5b2JhLm1lIiwiZ3JvdXAiOiJidXNpbmVzcyIsIm1zaXNkbiI6bnVsbCwiaWF0IjoxNzIyMTE4MzUxLCJleHAiOjE3MjIxMjAxNTF9.3Hm2aOQCYrZdR_Y7pLqnriQu6PA5rn6ovC0o6kbklj8"

def send_message_to_ayoba(phone_number, message):
    headers = {
        'Authorization': f'Bearer {"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ijk5MjlhODViMWI1ZWMxYWIwMDQ2M2Y1OGJjM2I4MmE0NWNlODUyZTQiLCJqaWQiOiI5OTI5YTg1YjFiNWVjMWFiMDA0NjNmNThiYzNiODJhNDVjZTg1MmU0QGF5b2JhLm1lIiwiZ3JvdXAiOiJidXNpbmVzcyIsIm1zaXNkbiI6bnVsbCwiaWF0IjoxNzIyMTIwNTE4LCJleHAiOjE3MjIxMjIzMTh9.SnC3SKeLf99BDbVzs0TjTjK5el40HgxSldfIKndtm1Q"}',
        'Content-Type': 'application/json'
    }
    payload = {
        'msisdns': [phone_number],
        'message': {
            'type': 'text',
            'text':  message
        }
    }
    response = requests.post("https://api.ayoba.me/v1/business/message", json=payload, headers=headers)
    return response.json()
@app.route('/ussd', methods=['POST'])
def ussd():
    ussd_string = request.form.get('ussd_string', '')
    phone_number = request.form.get('phone_number', '')

    # Determine the response based on the USSD string
    if ussd_string == '*123#':
        response_message = 'Welcome to CodeInc. Reply with 0 for Business list.'
    elif ussd_string == '0':
        response_message = '1. Business A\n2. Business B\n3. Business C'
        ussd_string = request.form.get('ussd_string', '')
     
    elif ussd_string == '1':
        response_message = 'You selected Business A. Reply with 9 to send Emergency message.'

    elif ussd_string == '2':
        response_message = 'You selected Business B. Reply with 9 to send Emergency message.'
    elif ussd_string == '3':
        response_message = 'You selected Business C. Reply with 9 to send Emergency message.'
 
    elif ussd_string == '9':
        
        response_message = "Enter message";
    
    elif ussd_string.startswith('msg:'):
        # Extract the message part
        message = ussd_string[len('msg:'):]
        # print(message)
        # Send the message using the Ayoba API
        result = send_message_to_ayoba("+27684085164", message)
        response_message = f'Message sent'
    else:
        response_message = 'Invalid option. Try again.'

    return jsonify({'response': response_message})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
