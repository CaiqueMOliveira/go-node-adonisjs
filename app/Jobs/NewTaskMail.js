'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewTaskMail-job'
  }

  // This is where the work is done.
  async handle ({
    addresseeEmail,
    addresseeUsername,
    taskTitle,
    isThereAttachment,
    rawAttachmentName,
    attachmentName
  }) {
    console.log(`Job started: ${NewTaskMail.key}`)
    await Mail.send(
      ['emails.new_task'],
      {
        addresseeEmail,
        addresseeUsername,
        taskTitle,
        isThereAttachment
      },
      message => {
        message
          .to(addresseeEmail)
          .from('caique.m.oliveira.br.br@gmail.com')
          .subject('You have a new task :)')

        if (isThereAttachment) {
          message.attach(Helpers.tmpPath(`uploads/${rawAttachmentName}`), {
            filename: attachmentName
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
