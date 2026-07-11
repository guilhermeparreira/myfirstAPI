import dotenv from 'dotenv'
import mongodb from "mongodb"
import app from "./server.js"
dotenv.config()
import ReviewsDAO from "./dao/reviewsDAO.js"
const MongoClient = mongodb.MongoClient

const mongo_username = process.env["MONGO_USERNAME"]
const mongo_password = process.env["MONGO_PASSWORD"]

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@moviereviewcluster.lmthx28.mongodb.net/?appName=MovieReviewCluster` // URI is a connection string with all informations required. Import with ``
const port = 8000

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
    .catch(err => {
        console.error(err.stack) // error message being printed
        process.exit(1) // it ends the program
    })
    .then(async client => { // the client comes from Mongo DB Connection
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => { //() => is a callback function with no parameters
            console.log(`Listening on port ${port}`)

        })
    })
