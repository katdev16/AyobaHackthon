let ussdState = ''; // Keeps track of the USSD state

function appendNumber(number) {
    const phoneNumberInput = document.getElementById('phoneNumber');
    phoneNumberInput.value += number;
}

function clearNumber() {
    const phoneNumberInput = document.getElementById('phoneNumber');
    phoneNumberInput.value = '';
    document.getElementById('ussdResponse').textContent = '';
    ussdState = ''; // Reset USSD state
}


async function submitUSSD() {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const ussdString = phoneNumberInput.value.trim();

    if (!ussdString) {
        document.getElementById('ussdResponse').textContent = 'Please enter a USSD code.';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/ussd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'ussd_string': ussdString,
                'phone_number': '' // Optional: Include phone number if needed
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Parse the JSON response
        const data = await response.json();
        // Update the content of the ussdResponse element with the response message
        document.getElementById('ussdResponse').textContent = data.response;

        if (data.response.startsWith('Enter message')) {
            document.getElementById('messageInput').style.display = 'block';
            document.getElementById('sendMessageBtn').style.display = 'block';
        } else {
            document.getElementById('messageInput').style.display = 'none';
            document.getElementById('sendMessageBtn').style.display = 'none';
        }
       
        phoneNumberInput.value = ''; // Clear input for new requests
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('ussdResponse').textContent = 'An error occurred. Please try again.';
        document.getElementById('ussdResponse').textContent = data.response;
    }
}
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    const phoneNumberInput = document.getElementById('phoneNumber');
    
    if (!message) {
        document.getElementById('ussdResponse').textContent = 'Please enter a message.';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/ussd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'ussd_string': 'msg:' + message,
                'phone_number': '' // Optional: Include phone number if needed
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('ussdResponse').textContent = data.response;

        // Hide the message input area
        document.getElementById('messageInput').style.display = 'none';
        document.getElementById('sendMessageBtn').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ussdResponse').textContent = 'An error occurred. Please try again.';
    }
}