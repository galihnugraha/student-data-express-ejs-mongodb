const fs = require('fs')

const dirPath = 'data'
const dataPath = 'data/mahasiswa.json'

//membuat folder data jika belum ada 
if (!fs.existsSync('./' + dirPath)) {
    fs.mkdirSync('./' + dirPath)
}

//membuat contacts.json jika belum ada
if (!fs.existsSync('./' + dataPath)) {
    fs.writeFileSync('./' + dataPath, '[]', 'utf-8')
}

//mengambil semua data mahasiswa
const loadMahasiswa = () => {
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8')
    const mahasiswa = JSON.parse(fileBuffer)
    return mahasiswa
}

//mencari satu data mahasiswa
const findMahasiswa = (findNim) => {
    const mahasiswa = loadMahasiswa()
    const dataFind = mahasiswa.filter((mhs) => mhs.nim.toLowerCase() === findNim.toLowerCase())[0]
    return dataFind
}

//menimpa / menuliskan file mahasiswa.json dengan data yang baru
const saveData = (mahasiswa) => {
    fs.writeFileSync(dataPath, JSON.stringify(mahasiswa))
}

// menambah data mahasiswa
const addMahasiswa = (mhsNew) => {
    const mahasiswa = loadMahasiswa()
    mahasiswa.push(mhsNew)
    saveData(mahasiswa)
}

//cek duplikat nim
const cekDuplikat = (nim) => {
    mahasiswa = loadMahasiswa()
    return mahasiswa.find(mhs => mhs.nim === nim)
}

module.exports = {
    loadMahasiswa, 
    findMahasiswa, 
    addMahasiswa, 
    cekDuplikat,
}