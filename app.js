const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

//ejs for view engine and layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)

app.get('/', (req, res) => {
    res.render('index', {
        title: "Halaman Home",
        layout: 'layouts/main-layout' 
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "Halaman About",
        layout: 'layouts/main-layout' 
    })
})

app.get('/data', (req, res) => {
    res.render('data', {
        title: "Data Mahasiswa",
        layout: 'layouts/main-layout' 
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})