if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const DB_URL = process.env.ATLASDB_URL
// const DB_URL = process.env.ATLASDB_URL||'mongodb+srv://svedansh0302:sFQd43eux9yd6bOx@cluster0.komsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(DB_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "653cd6bda600917744ca7927"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

initDB();