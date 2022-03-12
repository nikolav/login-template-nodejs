
const dotenv   = require("dotenv");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;


dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("open", () => 
  console.log(`connection open @mongoose`));


const userSchema = new Schema({
  name  : String,
  email : {
    type     : String,
    index    : true,
    required : true,
  },
  passwordHash: String,

  "_@": {
    type      : Date,
    default   : Date.now,
    immutable : true,
  },
});

const appDataSchema = new Schema({
  name: {
    type     : String,
    required : true,
    index    : true,
  },
  value: String,
});

// methods before compiling with mongoose.model
// schema.methods.<method> = function... -> @Model.prototype

const User    = model( process.env.MONGODB_COLLECTION_USERS  , userSchema    );
const AppData = model( process.env.MONGODB_COLLECTION_APPDATA, appDataSchema );

module.exports = { mongoose, User, AppData };
