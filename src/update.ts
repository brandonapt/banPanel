const gitPullOrClone = require('git-pull-or-clone')

gitPullOrClone('git@github.com:brandoge91/banPanel.git', '/', (err) => {
  if (err) throw err
  console.log('SUCCESS!')
})