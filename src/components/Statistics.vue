<template>
    <div v-show="this.$store.state.logged">
        <div  class="login">
            <h1>{{ $t("Statistics") }}</h1>
            <chart-pie name="Investments by product" :items="items" height="600px"></chart-pie>
        </div>
    </div>
</template>

<script>
    import ChartPie from './reusing/ChartPie.vue'
    import axios from "axios"
    export default {
        name: 'Statistics',
        components: {
            ChartPie,
        },
        data () {
            return {
                key:0,
                items:[],
            }
        },
        methods: {
            getStatistics(){
                axios.get(`${this.$store.state.apiroot}/api/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.items=response.data 
                }, (error) => {
                    this.parseResponseError(error)
                })
                .finally(() => (this.isLoading = false));
            }
        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
<style>
.login{
    padding:30px;
}
</style>
