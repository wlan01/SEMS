require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');
const { parse } = require('papaparse');
const { processPrompts } = require('./public/script.js');



// Create an instance of Express app
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000; // You can change the port as needed

// Use middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/csv' }));
app.use(bodyParser.json());



// In-memory storage for registered users (replace this with a database in production)
let registeredUsers = [];

app.post('/registration', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    if (registeredUsers.find(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already exists.' });
    }

    registeredUsers.push({ firstName, lastName, email, password });
    res.status(200).json({ message: 'Registration successful.' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login with email: ${email} and password: ${password}`);

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const user = registeredUsers.find(user => user.email === email && user.password === password);
    console.log('Found user:', user);

    if (user) {
        res.status(200).json({ message: 'Login successful.' });
    } else {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
});

// Route for handling CSV file upload
app.post('/indexAI', async (req, res) => {
    // Handle CSV file upload here
    parse(req.body, {
        header: true,
        complete: async function(results) {
            try {
                // Assuming 'parsedData' should be 'results.data' from the CSV parsing result
                const parsedData = results.data;
                console.log(parsedData)
                // ... Insert into MongoDB as you have in your `insertIntoMongoDB` function ...
                const url = process.env.Mongodb_Connection_String_1;
                const client = new MongoClient(url);
                const dbName = process.env.Database_Name;

             
                // Use connect method to connect to the server
                await client.connect();
                console.log('Connected successfully to server');
                const db = client.db(dbName);

                // Get the collection
                const collection = db.collection(process.env.Collection_Name);

                // Insert the parsed data
                const insertResult = await collection.insertMany(parsedData);
                console.log('Inserted documents =>', insertResult);
               
        
                // Send back a successful response
                res.status(200).send('CSV file uploaded and data inserted to MongoDB');
                // Ensures that the client will close when you finish/error
                await client.close();
            }  catch (err) {
                console.error('Error inserting data into MongoDB:', err);
                res.status(500).send(`Error inserting data into MongoDB: ${err.message}`);
            }            
        }
    });
});

/*app.post('/displaycsv', async (req, res) => {
    //const { option, uploadedCSVData, question } = req.body;
    res.redirect('/displaycsv.html');
});*/

app.post('/displaycsv', async (req, res) => {
    let { option, csvData, question } = req.body;

    try {
        if (option === 'image') {
            // Call the processPrompts function and expect an image URL as a string in return
            let output = await processPrompts(option, csvData, question);
            // Send the image URL back to the client
            res.json({ output });
        }
        else{
        let output = await processPrompts(option, csvData, question);
        
        // Assuming the output is directly sendable (e.g., a string for chat responses)
        // For image responses, you might need to handle them differently depending on the format
        res.json({ output });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the prompt' });
    }
});


// Serve static files (frontend)
//app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));



// Handle root path ("/") - Redirect to home page
app.get('/registrationPage', function (req, res){
    res.redirect('/registrationPage.html');
});

app.get('/login', function (req, res)  {
    res.redirect('/login.html');
});

app.get('/HomePage', function (req, res)  {
    res.sendFile('/HomePage.html');
});

app.get('/indexAI', function (req, res)  {
    try {
        // Fetch or compute data to send back
        //const data = {};
        res.redirect('/indexAI.html'); // Send JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/displaycsv', async (req, res) =>  {    
    const url = process.env.Mongodb_Connection_String_2;
    const dbName = process.env.Database_Name;

    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(process.env.Collection_Name);
        const data = await collection.find({}).toArray();

        //res.status(200).json(data).redirect('/indexAI.html');
        res.status(200).json(data)
    } catch (error) {
        res.status(500).send('Error fetching CSV data from MongoDB');
    } finally {
        await client.close();
    }


    //res.sendFile('/displaycsv');
});

app.get('/', function (req, res)  {
    res.redirect('/registrationPage.html');
});


// Start the server
app.listen(PORT, function ()  {
    console.log(`Server is running on port ${PORT}`);
});
