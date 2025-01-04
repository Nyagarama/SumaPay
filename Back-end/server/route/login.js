// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Dummy login validation
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
        return res.status(200).json({ message: 'Login successful.', user });
    } else {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
});
__esModule.exports = app;