const filesService = require('../services/files.service')

const getFilesData = async (req, res, next) => {
  try {
    const fileName = req.query?.fileName
    res.json(await filesService.getFilesData(fileName))
  } catch (err) {
    next(err)
  }
}

const getFilesList = async (req, res, next) => {
  try {
    res.json(await filesService.getFilesList())
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getFilesData,
  getFilesList
}