const fs = require('fs')

//membuat folder data jika belum ada 
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

//membuat contacts.json jika belum ada
const dataPath = './data/mahasiswa.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadMahasiswa = () => {
    const fileBuffer = fs.readFileSync('data/mahasiswa.json', 'utf-8')
    const mahasiswa = JSON.parse(fileBuffer)
    return mahasiswa
}

const findMahasiswa = (findNim) => {
    const mahasiswa = loadMahasiswa()
    const dataFind = mahasiswa.filter((mhs) => mhs.nim.toLowerCase() === findNim.toLowerCase())[0]
    return dataFind
}

module.exports = {loadMahasiswa, findMahasiswa}