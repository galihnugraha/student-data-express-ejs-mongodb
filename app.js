const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {loadMahasiswa, findMahasiswa} = require('./utils/mahasiswa')
const app = express()
const port = 3000

//ejs for view engine and layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)

//built-in middleware
app.use(express.static('public'))

//routing
app.get('/', (req, res) => {
    res.render('index', {
        name: 'home',
        title: "Halaman Home",
        layout: 'layouts/main-layout' 
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        name: 'about',
        title: "Halaman About",
        layout: 'layouts/main-layout' 
    })
})

app.get('/data', (req, res) => {
    const mahasiswa = loadMahasiswa()
    res.render('data', {
        name: 'data',
        title: "Data Mahasiswa",
        layout: 'layouts/main-layout',
        mahasiswa 
    })
})

app.get('/data/:nim', (req, res) => {
    const mhs = findMahasiswa(req.params.nim)
    res.render('detail', {
        name: 'detail',
        title: "Detail Mahasiswa",
        layout: 'layouts/main-layout',
        mhs 
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