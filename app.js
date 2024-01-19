const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {body, validationResult} = require('express-validator')
const {
    loadMahasiswa, 
    findMahasiswa, 
    addMahasiswa,
    cekDuplikat,
} = require('./utils/mahasiswa')

const app = express()
const port = 3000

//ejs and express-ejs-layouts for view engine and layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)

//built-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//routing
//menampilkan halaman home
app.get('/', (req, res) => {
    res.render('index', {
        name: 'home',
        title: "Halaman Home",
        layout: 'layouts/main-layout' 
    })
})

//menampilkan halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        name: 'about',
        title: "Halaman About",
        layout: 'layouts/main-layout' 
    })
})

//menampilan halaman form tambah data mahasiswa
app.get('/data/add', (req, res) => {
    res.render('add-data', {
        name: 'data',
        title: "Tambah Data Mahasiswa",
        layout: 'layouts/main-layout'
    })
})

//proses tambah data mahasiswa
app.post(
    '/data',
    [ //express-validator 
        body('nim')
            .isLength({ min: 9, max: 9 }).withMessage('NIM harus terdiri dari 9 digit angka')
            .isNumeric().withMessage('NIM harus berupa angka')
            .custom(value => {
                const duplikat = cekDuplikat(value);
                if (duplikat) {
                    throw new Error('NIM sudah digunakan, data tidak valid!');
                }
                return true;
            }),
        body('email')
            .isEmail().withMessage('Email tidak valid!')
            .custom(value => {
                const duplikat = cekDuplikat(value)
                if (duplikat) {
                    throw new Error('Email sudah digunakan, data tidak valid!')
                }
                return true;
            }),
        body('tahunMasuk').isNumeric().withMessage('Kolom tahun yang diinput harus merupakan angka!')
    ], 
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({errors: errors.array()})
            res.render('add-data', {
                name: 'data',
                title: "Tambah Data Mahasiswa",
                layout: 'layouts/main-layout',
                errors: errors.array()
            })
        } else {
            addMahasiswa(req.body)
            res.redirect('data')
        }
})

//menampilkan halaman data mahasiswa
app.get('/data', (req, res) => {
    const mahasiswa = loadMahasiswa()
    res.render('data', {
        name: 'data',
        title: "Data Mahasiswa",
        layout: 'layouts/main-layout',
        mahasiswa 
    })
})

//menampilkan halaman data detail mahasiswa
app.get('/data/detail/:nim', (req, res) => {
    const mhs = findMahasiswa(req.params.nim)
    res.render('detail', {
        name: 'data',
        title: "Detail Mahasiswa",
        layout: 'layouts/main-layout',
        mhs 
    })
})

//middleware untuk route yang tidak tersedia
app.use('/data', (req, res) => {
    res.redirect('/data');
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>')
})

//port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})