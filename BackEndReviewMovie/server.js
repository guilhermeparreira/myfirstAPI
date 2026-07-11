import cors from "cors"
import express from "express"
import reviews from "./api/reviews.route.js"

const app = express()

app.use(cors())
app.use(express.json()) // It allows the request to be sent as json to the web through this middleware

app.use("/api/v1/reviews", reviews) // Best practice /api/version/name, routes from reviews. it is also like the base URL
app.use("*", (req, res) => res.status(404).json({ error: "not found" })) // req is for request, res is for response. This when a user request info from a different page (*) than /api/v1/reviews

export default app
