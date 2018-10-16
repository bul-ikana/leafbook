//                         //
// Basic app configuration //
//                         //
const API_URL = "https://leafbook.herokuapp.com/api/"

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

  computed: {
    leaves () {
      return this.$store.getters.bookLeaves
    },
    loading () {
      return this.$store.getters.loading
    },
    bookname () {
      return this.$store.getters.bookname
    }
  },

  created () {
    this.$store.dispatch('fetchBookLeaves', this.$route.params.book)
  }
})

// Components //

// Autoresize textarea

const autoarea = Vue.component('autoarea', {
  template: '#autoarea',

  props: [
    'value',
    'handleChange'
  ],

  mounted () {
    autosize(this.$el)
  },

  methods: {
    onChange: function (event) {
      this.$emit('update:value', event.target.value)
    }
  }
})

// Leaf component
const leaf = Vue.component('leaf', {
  template: '#leaf-template',

  props: [
    'id',
    'color',
    'title',
    'content'
  ],

  data () {
    return {
      coloropen: false,
      livetitle: this.title,
      livecontent: this.content
    }
  },

  computed: {
    dirty () {
      return (this.title !== this.livetitle) ||
        (this.content !== this.livecontent) 
    },

    cardcolor () {
      return {
        'card-leaf': this.color == 1,
        'card-wood': this.color == 2,
        'card-berry': this.color == 3,
        'card-flower': this.color == 4
      }
    }
  },

  methods: {
    handleChange(e) {
      this.text = e.target.value
    },

    togglePopup () {
      this.coloropen = !this.coloropen
    },

    setColor (color) {
      let leaf = {
        id: this.id,
        color: color,
      }
      
      this.$store.dispatch('colorLeaf', leaf)
    },

    saveLeaf () {
      let leaf = {
        id: this.id,
        color: this.color,
        title: this.livetitle,
        content: this.livecontent
      }

      this.$store.dispatch('saveLeaf', leaf)
    },

    deleteLeaf () {
      this.$store.dispatch('deleteLeaf', this.id)
    }
  }
})

// New leaf component
const newleaf = Vue.component('newleaf', {
  template: '#newleaf-template',

  data () {
    return {
      color: 0,
      title: '',
      content: '',
      coloropen: false
    }
  },

  computed: {
    dirty () {
      return (this.title !== '') || (this.content !== '')
    },

    cardcolor () {
      return {
        'card-leaf': this.color == 1,
        'card-wood': this.color == 2,
        'card-berry': this.color == 3,
        'card-flower': this.color == 4
      }
    }
  },

  methods: {
    handleChange(e) {
      this.text = e.target.value
    },

    setColor (color) {
      this.color = color
    },

    togglePopup () {
      this.coloropen = !this.coloropen
    },

    createLeaf () {
      let leaf = {
        color: this.color,
        title: this.title,
        content: this.content
      }

      this.$store.dispatch('createLeaf', leaf)
      this.color = 0
      this.title = ''
      this.content = ''
    },

    deleteLeaf () {
      this.color = 0
      this.title = ''
      this.content = ''
    }
  }
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

//                  //
// Store definition //
//                  //

const store = new Vuex.Store({
  state: {
    leaves: [],
    bookname: '',
    loading: false
  },

  mutations: {
    SET_LOADING (state) {
      state.loading = true
    },

    SET_NOT_LOADING (state) {
      state.loading = false
    },

    SET_BOOKNAME (state, bookname) {
      state.bookname = bookname
    },

    INITIALIZE (state, leaves) {
      state.leaves = leaves
    },

    CREATE_LEAF (state, leaf) {
      state.leaves = [leaf, ...state.leaves]
    },

    SAVE_LEAF (state, newleaf) {
      state.leaves = state.leaves.map(leaf => {
        if (leaf.id === newleaf.id) {
          leaf.color = newleaf.color
          leaf.title = newleaf.title
          leaf.content = newleaf.content
        }
        return leaf
      })
    },

    COLOR_LEAF (state, newleaf) {
      state.leaves = state.leaves.map(leaf => {
        if (leaf.id === newleaf.id) {
          leaf.color = newleaf.color
        }
        return leaf
      })
    },

    DELETE_LEAF (state, id) {
      state.leaves = state.leaves.filter(leaf => {
        return leaf.id !== id
      })
    }
  },

  actions: {
    fetchBookLeaves (state, bookname) {
      store.commit('SET_BOOKNAME', bookname)
      store.commit('SET_LOADING')
      axios
        .get(API_URL + 'books/' + store.getters.bookname)
        .then( response => {
          store.commit('SET_NOT_LOADING')
          if (response.data.leaves) store.commit('INITIALIZE', response.data.leaves)
        })
    },

    createLeaf (state, leaf) {
      store.commit('SET_LOADING')
      axios
        .post(API_URL + 'books/' + store.getters.bookname + '/leaves', 
          leaf
        )
        .then( response => {
          store.commit('SET_NOT_LOADING')
          store.commit('CREATE_LEAF', response.data)
        })
    },

    saveLeaf (state, leaf) {
      store.commit('SAVE_LEAF', leaf)
      store.commit('SET_LOADING')
      axios
        .put(API_URL + 'leaves/' + leaf.id, 
          store.getters.leaf(leaf.id)
        )
        .then( response => {
          store.commit('SET_NOT_LOADING')
        })
    },

    colorLeaf (state, leaf) {
      store.commit('COLOR_LEAF', leaf)
      store.commit('SET_LOADING')
      axios
        .put(API_URL + 'leaves/' + leaf.id, { color: leaf.color } )
        .then( response => {
          store.commit('SET_NOT_LOADING')
        })
    },

    deleteLeaf (state, id) {
      store.commit('DELETE_LEAF', id)
      store.commit('SET_LOADING')
      axios
        .delete(API_URL + 'leaves/' + id)
        .then( response => {
          store.commit('SET_NOT_LOADING')
        })
    }
  },

  getters: {
    bookLeaves: state => {
      return state.leaves
    },

    loading: state => {
      return state.loading
    },

    bookname: state => {
      return state.bookname
    },

    leaf: (state) => (id) => {
      return state.leaves.find(leaf => {
        return leaf.id === id
      })
    }
  }
})

//                //
// Vue definition //
//                //

var vm = new Vue({
  el: '#app',
  store: store,
  router: router
})
