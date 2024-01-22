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
    const dataFind = mahasiswa.find(mhs => mhs.nim.toLowerCase() === findNim.toLowerCase())
    return dataFind
}

//menimpa / menuliskan file mahasiswa.json dengan data yang baru
const saveData = (mahasiswa) => {
    fs.writeFileSync(dataPath, JSON.stringify(mahasiswa))
}

//menambah data mahasiswa
const addMahasiswa = (mhsNew) => {
    const mahasiswa = loadMahasiswa()
    mahasiswa.push(mhsNew)
    saveData(mahasiswa)
}

//hapus data mahasiswa
const deleteMahasiswa = (mhsDelete) => {
    const mahasiswa = loadMahasiswa()
    const filteredMhs = mahasiswa.filter(mhs => mhs.nim != mhsDelete)
    saveData(filteredMhs)
}

//mengubah data mahasiswa
const updateMahasiswa = (mhsEdit) => {
    const mahasiswa = loadMahasiswa()
    //hilangkan mahasiswa lama yang nim = oldNim
    const filteredMhs = mahasiswa.filter(mhs => mhs.nim != mhsEdit.oldNim)
    //hapus data oldNim dan oldEmail
    delete mhsEdit.oldNim
    delete mhsEdit.oldEmail
    //push and save to json 
    filteredMhs.push(mhsEdit)
    saveData(filteredMhs)
}

//cek duplikat nim pada json
const cekDuplikatNIM = (nim) => {
    const mahasiswa = loadMahasiswa()
    return mahasiswa.find(mhs => mhs.nim === nim)
}

//cek duplikat email pada json
const cekDuplikatEmail = (email) => {
    const mahasiswa = loadMahasiswa()
    return mahasiswa.find(mhs => mhs.email === email)
}

module.exports = {
    loadMahasiswa, 
    findMahasiswa, 
    addMahasiswa,
    deleteMahasiswa,
    updateMahasiswa, 
    cekDuplikatNIM,
    cekDuplikatEmail,
}