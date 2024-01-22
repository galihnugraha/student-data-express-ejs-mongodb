const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {body, validationResult} = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const {
    loadMahasiswa, 
    findMahasiswa, 
    addMahasiswa,
    deleteMahasiswa,
    updateMahasiswa,
    cekDuplikatNIM,
    cekDuplikatEmail,
} = require('./utils/mahasiswa')

// init app
const app = express()
const port = 3000

//ejs and express-ejs-layouts for view engine and layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)

//built-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//session, cookie parser, dan flash
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)
app.use(flash())

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
                const duplikat = cekDuplikatNIM(value);
                if (duplikat) {
                    throw new Error('NIM sudah digunakan, data tidak valid!');
                }
                return true;
            }),
        body('email')
            .isEmail().withMessage('Email tidak valid!')
            .custom(value => {
                const duplikat = cekDuplikatEmail(value)
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
            //kirimkan flash message
            req.flash('msg', 'Data berhasil ditambahkan')
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
        mahasiswa ,
        msg: req.flash('msg')
    })
})

//proses delete data
app.get('/data/delete/:nim', (req, res) => {
    const mhsDelete = findMahasiswa(req.params.nim)

    if (!mhsDelete) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        deleteMahasiswa(req.params.nim)
        //kirimkan flash message
        req.flash('msg', 'Data berhasil dihapus')
        res.redirect('data')
    }
})

//menampilan halaman form edit data mahasiswa
app.get('/data/edit/:nim', (req, res) => {
    const mhsEdit = findMahasiswa(req.params.nim)

    res.render('edit-data', {
        name: 'data',
        title: "Ubah Data Mahasiswa",
        layout: 'layouts/main-layout',
        mhs: mhsEdit
    })
})

//proses edit data mahasiswa
app.post(
    '/data/update',
    [ //express-validator 
        body('nim')
            .isLength({ min: 9, max: 9 }).withMessage('NIM harus terdiri dari 9 digit angka')
            .isNumeric().withMessage('NIM harus berupa angka')
            .custom((value, {req}) => {
                const duplikatNim = cekDuplikatNIM(value);
                if ((value !== req.body.oldNim) && duplikatNim) {
                    throw new Error('NIM sudah digunakan, data tidak valid!');
                }
                return true;
            }),
        body('email')
            .isEmail().withMessage('Email tidak valid!')
            .custom((value, {req}) => {
                const duplikatEmail = cekDuplikatEmail(value)
                if ((value !== req.body.oldEmail) && duplikatEmail) {
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
            res.render('edit-data', {
                name: 'data',
                title: "Ubah Data Mahasiswa",
                layout: 'layouts/main-layout',
                errors: errors.array(),
                mhs: req.body
            })
        } else {
            updateMahasiswa(req.body)
            //kirimkan flash message
            req.flash('msg', 'Data berhasil diubah')
            res.redirect('data')
        }
})

//menampilkan halaman data detail mahasiswa
app.get('/data/detail/:nim', (req, res) => {
    const mhsDetail = findMahasiswa(req.params.nim)
    res.render('detail', {
        name: 'data',
        title: "Detail Mahasiswa",
        layout: 'layouts/main-layout',
        mhs: mhsDetail 
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