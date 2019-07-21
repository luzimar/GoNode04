'use strict';

const Mail = use('Mail')
const Helpers = use('Helpers')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  const instanceHaveUser = !!taskInstance.user_id
  const instanceChanged = !!taskInstance.dirty.user_id

  if (taskInstance.created_at === taskInstance.updated_at) {
    if (!instanceHaveUser) return
  } else if (!instanceChanged) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = taskInstance
  await Mail.send(
    ['emails.new_task'],
    {
      username,
      title,
      hasAttachment: !!file
    },
    message => {
      message
        .to(email)
        .from('lzm.spfc@gmail.com', 'Luzimar | GoStack 6.0')
        .subject('Nova tarefa para você')

      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        })
      }
    }
  )
};
