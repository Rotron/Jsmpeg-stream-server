Vue.component('Statstable', {

    data() {
      return {
			  allStreamClient: [],
        tablefields: ["srcAddr", "streamUrl", "appName", "streamName", "jsmplayer"]
      }
    },

    props: [],

    template: 
        `<b-table hover :fields="tablefields" :items="allStreamClient">
         <template slot="jsmplayer" slot-scope="data">
           {{data.index + 1}}
         </template>
       </b-table>`,

	  created() {},
		mounted() {},
    methods: {},
		computed: {}
})

new Vue({
    el: '#main'
});
