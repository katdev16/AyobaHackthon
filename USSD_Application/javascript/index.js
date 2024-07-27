let ussdState = ''; // Keeps track of the USSD state

// Simulates the USSD response based on input
function getUSSDResponse(ussdString) {
    // Define possible USSD responses
    const ussdResponses = {
        '123': 'Balance: $10',
        '456': 'Data: 2GB remaining',
        '789': 'Call Time: 30 minutes remaining',
        '*100#': 'Welcome to the service menu',
        '*101#': 'Account balance: $50',
        'default': 'Invalid USSD code'
    };

    // Return the response based on the input USSD string
    return ussdResponses[ussdString] || ussdResponses['default'];
}

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

// function submitUSSD() {
//     const phoneNumberInput = document.getElementById('phoneNumber');
//     const ussdString = phoneNumberInput.value.trim(); // Trim whitespace

//     // Check if the input is not empty
//     // if (!ussdString) {
//     //     document.getElementById('ussdResponse').textContent = 'Please enter a USSD code.';
//     //     return;
//     // }
//     if(ussdString=="*888#"){
//         document.getElementById('ussdResponse').textContent = 'Welcome to CodeInc. Reply with 1 for Businesses list.';
//         phoneNumberInput = document.getElementById('phoneNumber').value="";
//         ussdString=="";
//         if(ussdString=="1"){
//             document.getElementById('ussdResponse').textContent = '1.MTN\n 2.CellC\n 3.Vodacom';
//             phoneNumberInput = document.getElementById('phoneNumber').value="";
//         return;
//         }
//     }
//     if (ussdString === "1") {
//         document.getElementById('ussdResponse').textContent = '1. MTN\n2. CellC\n3. Vodacom';
//         phoneNumberInput.value = ''; // Clear the input field
//         return;
//     }

//     // Get the USSD response
//     const responseMessage = getUSSDResponse(ussdString);

//     // Display the response message
//     document.getElementById('ussdResponse').textContent = responseMessage;

//     // Clear input for new requests after initial submission
//     phoneNumberInput.value = '';
//     ussdState = ''; // Reset state for new interactions
// }


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