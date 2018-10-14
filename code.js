//                      //
// Component definition //
//                      //

// Pages //

// Book Selection Page
const bookSelectionPage = Vue.component('book-selection', {
  template: '#book-selection'
})

const leavesPage = Vue.component('leaves-page', {
  template: '#leaves-page'
})

//                   //
// Router definition //
//                   //

const router = new VueRouter ({
  routes: [
    {
      path: '/',
      name: 'home',
      component: bookSelectionPage
    },
    {
      path: '/leaves',
      name: 'leaves',
      component: leavesPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

//                //
// Vue definition //
//                //

var vm = new Vue({
  el: '#app',
  router: router
})
