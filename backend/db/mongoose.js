const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/sociocircle', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});