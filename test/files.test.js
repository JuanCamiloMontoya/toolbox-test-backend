const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../src/server')

chai.should()
chai.use(chaiHttp)
chai.use(require('chai-json-schema'))
const expect = chai.expect

const lineSchema = {
  title: 'lineSchema',
  type: 'object',
  required: ['text', 'number', 'hex'],
  properties: {
    text: { type: 'string' },
    number: { type: 'string' },
    hex: { type: 'string' },
  }
}

describe('Files Services', () => {

  describe('GET /files/data', () => {
    it('Debería retornar los archivos formateados', (done) => {
      chai.request(server)
        .get('/files/data')
        .end((err, res) => {

          res.should.have.status(200)

          if (res.body.should.be.a('array')) {

            res.body.forEach(fileObj => {
              expect(fileObj).should.be.a('object')
              expect(fileObj).have.property('file')

              if (expect(fileObj).have.property('lines'))
                fileObj.lines.forEach(line => expect(line).to.be.jsonSchema(lineSchema))

            })
          }
          done()
        })
    }).timeout(5000)
  })

  describe('GET /files/data?fileName=file.csv', () => {
    it('Debería retornar el archivo formateado', (done) => {
      chai.request(server)
        .get('/files/data')
        .query({ fileName: 'test3.csv' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('file').eq('test3.csv')

          if (res.body.should.have.property('lines'))
            res.body.lines.forEach(line => expect(line).to.be.jsonSchema(lineSchema))

          done()
        })
    })

    it('Debería retornar un mensaje de error', (done) => {
      chai.request(server)
        .get('/files/data')
        .query({ fileName: 'test3.txt' })
        .end((err, res) => {
          res.should.have.status(502)
          done()
        })
    })
  })

  describe('GET /files/list', () => {
    it('Debería retornar la lista de archivos', (done) => {
      chai.request(server)
        .get('/files/list')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    }).timeout(5000)
  })
})