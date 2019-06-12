'use strict'

const Kue = use('Kue')
const NewTaskMail = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

async function sendNewTaskMail ({
  addresseeEmail,
  addresseeUsername,
  attachment: { isThereAttachment, attachmentName, rawAttachmentName },
  taskTitle
}) {
  Kue.dispatch(
    NewTaskMail.key,
    {
      addresseeEmail,
      addresseeUsername,
      isThereAttachment,
      attachmentName,
      rawAttachmentName,
      taskTitle
    },
    {
      attempts: 3
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
