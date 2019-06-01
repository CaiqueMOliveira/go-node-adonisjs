'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const fileToBeUploaded = request.file('file', { size: '2mb' })

      const newFileName = `${Date.now()}.${fileToBeUploaded.subtype}`

      await fileToBeUploaded.move(Helpers.tmpPath('uploads'), {
        name: newFileName
      })

      if (!fileToBeUploaded.moved()) throw fileToBeUploaded.error()

      const createdFile = await File.create({
        name: fileToBeUploaded.clientName,
        rawName: newFileName,
        type: fileToBeUploaded.type,
        subtype: fileToBeUploaded.subtype
      })

      return createdFile
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong while uploading the file' }
      })
    }
  }
}

module.exports = FileController
