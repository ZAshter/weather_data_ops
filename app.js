import express from 'express' // to use this we use const app= express
import fs from 'fs' // import and require are the same
import path from'path'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const PORT = process.env.PORT
const DATA_DIR = path.join(import.meta.dirname, 'data') 
const WEATHER_FILE = path.join(DATA_DIR, 'weather,json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') 
app.use(express.static(path.join(import.meta.dirname, 'public'))) // as we are only doing back end we are using static which doesnt reload. 
//static tells express we want to automatically serve everything inside this folder and in the folder we have html etc. 

app.get('/api/weather', (req, res) => {
    try {
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'UTF-8'))
        res.json(weatherData)
    } catch {
        res.status(404).json({error: 'No weather data available. Error: ${err}'})
    }
}) //shows last pulled temperature

app.get('/api/weather-log', (req, res) => {
    try {
        const lines = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n')
        const timestamps = []
        const temps = []

        for (const line of lines.slice(1)) {
            const [timestamp, , temperature] = line.split(',')
            if (timestamp && temperature) {
                timestamps.push(timestamp)
                temps.push(parseFloat(temperature))
            }
        }
        res.json({ timestamps, temps })
    } catch (err) {
        res.status(404).json({ error: `No weather log available. Error: ${err}`})
    }
})// shows history of temperature

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})