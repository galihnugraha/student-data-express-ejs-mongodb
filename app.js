const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const app = express()
const port = 3000

//ejs for view engine and layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)

//third-party middleware
app.use(morgan('dev'))

//built-in middleware
app.use(express.static('public'))

//application level middleware
app.use((res, req, next) => {
    console.log('Time: ', new Date(Date.now()).toString())
    next()   
})

//routing
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


//middleware untuk route yang tidak tersedia
app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>')
})


//port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})