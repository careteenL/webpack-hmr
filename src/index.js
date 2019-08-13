import './client.js'

var root = document.getElementById('root')
function render () {
  root.innerHTML = require('./content.js').default
}
render()

if (module.hot) {
  module.hot.accept(['./content.js'], () => {
    render()
  })
}
