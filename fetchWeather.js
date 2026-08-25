import fs from 'fs' //stands for file system 
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const DATA_DIR = path.join(import.meta.dirname, 'data') //creates a folder called data in weather-data-ops
fs.mkdirSync(DATA_DIR, { recursive: true}) // DATA_DIR stores the path to a folder called data. Then mkdirSync creates that folder if needed. { recursive: true } means it won't throw an error just because the folder already exists. this folder exist?

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') //comma separated values file

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.CITY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try{
        const response = await fetch(url) //wait and get data from the url 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        const nowUTC = new Date().toISOString() //return a date as a string in ISO format
        data._last_updated_utc = nowUTC
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)) //is writing data that we got from weather.json. null and 2 make it human readible and indented.

        if (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, 'timestamp,city,temperature,description\n') // remember with csv there are no spaces and \n means create new line when gets to end of script- this part if creating headers in our csv file
        }
        const logEntry =`${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`
        fs.appendFileSync(LOG_FILE, logEntry)

        console.log(`Weather data updated for ${city} at ${nowUTC}`)
    } catch (err) {
        console.log(`Error fetching weather: ${err}`)
    } 
}

fetchWeather()

 