const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DBurl, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:');
});
