const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const { Agent } = require('http');
app.use(bodyParser.json({ limit: '10mb' }));
require('dotenv').config();
const uri = process.env.MONGODB_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



const mongoURI = 'mongodb+srv://saniulsaz:12345@roktodin.abnxvco.mongodb.net/Chine-Rakhun?retryWrites=true&w=majority'; // Use your MongoDB URI here
mongoose.connect(mongoURI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use(express.static(path.join(__dirname,'src')));
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'src','index.html'));
});
app.get('/admin',(req,res)=>
{
    res.sendFile(path.join(__dirname,'src','admin.html'));
});
app.get('/upload',(req,res)=>
{
    res.sendFile(path.join(__dirname,'src','upload.html'));
});


const userSchema = new mongoose.Schema({
    name: String,
    comment: String,
    deptName: String,
    image: String,
});
const User = mongoose.model('users', userSchema);
module.exports = User;

//Admin
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const Admin = new mongoose.model('admin',adminSchema);
module.exports = Admin;

app.post('/api/admins', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const newAdmin = await Admin.create({ username, password });
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create admin', details: error.message });
    }
});


// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, comment, deptName, image } = req.body;
        
        console.log('Received data:', req.body);

        if (!name || !comment || !deptName || !image) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = new User({ name, comment, deptName, image });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.get('/usersinfo', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});







app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});