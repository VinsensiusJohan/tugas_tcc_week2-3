import express from "express"
import cors from "cors"
import route from "./route/Route.js"

const app = express()
const port = 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(route)

app.get('/', (req, res) => {
    res.send('index.js on');
})

app.listen(port, () => console.log("Server On"))

