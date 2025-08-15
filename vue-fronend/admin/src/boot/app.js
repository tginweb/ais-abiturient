import App from '@tgin/main/common/lib/app/App'

const app = new App();

app.setAppScope('admin')

app.registerModules([
  require('@tgin/main/module'),

 // require('@tgin/prime/module'),

  require('@tgin/menu/core/module'),
  require('@tgin/menu/pub/module'),

  require('@project/user/core/module'),
  require('~module/user/module'),

  require('@tgin/ui/core/module'),
  require('@tgin/ui/admin/module'),

  require('@tgin/tagger/core/module'),
  require('@tgin/tagger/admin/module'),

  require('@tgin/pivot/module'),
  require('@tgin/widget/module'),
  //require('@tgin/spreadsheet/module'),

  require('~module/edu-org/module'),
  require('~module/edu-epgu/module'),
  require('~module/edu-fis/module'),

  require('~module/messenger/module'),
  require('~module/file/module'),

  require('~module/app/module'),
])


export default app;



