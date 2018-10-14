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
      bookname: ''
    }
  }
})

// Leaves page
const leavesPage = Vue.component('leaves-page', {
  template: '#leaves-page',

  data () {
    return {
      leaves: [],
      loading: true,
      bookname: this.$route.params.book
    }
  },

  created () {
    axios
      .get(API_URL + this.bookname)
      .then(response => {
        this.loading = false
        if (response.data.leaves) this.leaves = response.data.leaves
      })
  }
})

// Components //

// Leaf component
const leaf = Vue.component('leaf', {
  template: '#leaf-template',

  props: [
    'id',
    'title',
    'content'
  ]
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
      path: '/leaves/:book',
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
