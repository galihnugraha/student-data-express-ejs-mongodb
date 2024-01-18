const express = require('express')
const app = express()
const port = 3000

//ejs for view engine
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/data', (req, res) => {
    res.render('data')
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})