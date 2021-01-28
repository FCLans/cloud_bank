const fs = require('fs')
const File = require('../models/File')
const config = require('config')
const path = require('path')

class FileService {
  createDir(file) {
    const filePath = path.dirname(config.get('filePath'))
    return new Promise((resolve, reject) => {
      try {
      } catch (e) {
        return reject({ message: 'Ошибка с файлом' })
      }
    })
  }
}

module.exports = new FileService()
