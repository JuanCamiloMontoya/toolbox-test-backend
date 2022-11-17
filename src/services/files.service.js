const axios = require("axios")

const reqConfig = {
  headers: { authorization: 'Bearer aSuperSecretKey' }
}

const baseUrl = 'https://echo-serv.tbxnet.com/v1'

const getFilesData = async (fileName) => {

  let formattedEndData = []

  if (fileName)
    return await formatFile(fileName)

  const { data: filesData } = await axios.get(`${baseUrl}/secret/files`, reqConfig)

  if (filesData?.files?.length > 0) {
    for (const file of filesData.files) {
      try {

        const formattedData = await formatFile(file)
        if (formattedData)
          formattedData.lines.length && formattedEndData.push(formattedData)

      } catch (error) {

        // console.log("ERROR", error?.response?.statusText || error.toString())
      }
    }
  }

  return formattedEndData
}

const formatFile = async (fileName) => {

  let fileData

  try {
    const { data } = await axios.get(`${baseUrl}/secret/file/${fileName}`, reqConfig)
    fileData = data
  } catch (error) {
    throw { statusCode: 502, message: 'No es posible obtener el archivo del proveedor!' }
  }

  const splitData = fileData.split(/\r?\n|\r|\n/g)

  let formattedData = {
    file: fileName,
    lines: []
  }

  if (splitData.length > 1)

    for (let i = 1; i < splitData.length; i++) {

      const fields = splitData[i].split(',')

      if (fields.length < 4)
        continue

      formattedData.lines.push({
        text: fields[1],
        number: fields[2],
        hex: fields[3]
      })
    }

  return formattedData
}

const getFilesList = async () => {

  const { data: filesData } = await axios.get(`${baseUrl}/secret/files`, reqConfig)

  return filesData
}

module.exports = {
  getFilesData,
  getFilesList
}