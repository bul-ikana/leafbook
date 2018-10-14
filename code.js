//                      //
// Component definition //
//                      //

// Pages //

// Book Selection Page
const bookSelectionPage = Vue.component('book-selection', {
  template: '#book-selection'
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
