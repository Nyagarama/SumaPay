import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// user data
const users = {
    user1: { password: 'password1' },
    user2: { password: 'password2' }
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Login route
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.user = username;
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Protected route
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.session.user}`);
});

// Logout session route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        } else {
            res.send('Logout successful');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
