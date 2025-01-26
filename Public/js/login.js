// Login form submission
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email == "" || !password == "") {
        console.log('Email and password are required.');
        return;

        // try {
        //     const response = await fetch('/signin', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email, password })
        //     });
    
        //     if (!response.ok) {
        //         const errorText = await response.text();
        //         throw new Error(errorText || 'An error occurred during login.');
        //         console.log('Login successful.');
        //     }
    
        //     const result = await response.json().catch(() => {
        //         throw new Error('Invalid JSON response.');
        //     });
        //     console.log(result.message);
    
        //     alert('Login successful.');
        //     window.location.assign('./dashboard.html');
        // } catch (error) {
        //     console.error('Error:', error);
        //     alert(error.message || 'An error occurred. Please try again.');
        // }
    }

    
});