//                         //
// Basic app configuration //
//                         //
const API_URL = ""

//                      //
// Component definition //
//                      //

// Pages //

// Book Selection Page
const bookSelectionPage = Vue.component('book-selection', {
  template: '#book-selection',

  data () {
    return {
      bookname: '',
      loading: false
    }
  },

  methods: {
    getBook: function () {
      this.loading = true

      axios
        .get(API_URL + this.bookname)
        .then(response => {
          console.log(response.data)
          this.loading = false
        })
    }
  }
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
