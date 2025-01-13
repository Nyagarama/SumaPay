// Login route
app.post('/login.js', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // login validation
    const user = user.find(u => u.email === 'larteyernest@hotmail.com');
    if (user && user.password === 'Stonecold') {
        res.status(200).json({ message: 'Login successful.', user });
        return;
    } else {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
});
__esModule.exports = app;