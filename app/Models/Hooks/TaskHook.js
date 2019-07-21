'use strict';

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

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
  Kue.dispatch(Job.key, { email, username, title, file }, { attempts: 3 })
};
