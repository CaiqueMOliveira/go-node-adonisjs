'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')
const TaskHook = (exports = module.exports = {})

async function sendNewTaskMail ({
  addresseeEmail,
  addresseeUsername,
  attachment: { isThereAttachment, attachmentName, rawAttachmentName },
  taskTitle
}) {
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

TaskHook.sendNewTaskMailOnCreateNewTask = async taskInstance => {
  if (!taskInstance.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = taskInstance
  const attachment = {
    isThereAttachment: !!file,
    attachmentName: file.name,
    rawAttachmentName: file.rawName
  }

  sendNewTaskMail({
    addresseeEmail: email,
    addresseeUsername: username,
    attachment,
    taskTitle: title
  })
}

TaskHook.sendNewTaskMailOnUpdateResponsibleUser = async taskInstance => {
  if (!taskInstance.user_id || !taskInstance.dirty.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = taskInstance
  const attachment = {
    isThereAttachment: !!file,
    attachmentName: file.name,
    rawAttachmentName: file.rawName
  }

  sendNewTaskMail({
    addresseeEmail: email,
    addresseeUsername: username,
    attachment,
    taskTitle: title
  })
}
