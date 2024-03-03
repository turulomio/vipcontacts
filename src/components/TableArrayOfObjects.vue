<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="aoo" class="elevation-1" :key="key" >
        </v-data-table>            
    </div>

</template>

<script>
    export default {
        props: {
            aoo: { // array of objects
                required: true
            },
        },
        data () {
            return {
                key:0, 
            }
        },
        computed: {
            tableHeaders(){
                var r=[]
                if (this.aoo.length>0){
                    for (const o in this.aoo[0]){
                        r.push({
                            title: o,
                            value: o,
                            sortable:true,

                        })

                    }
                }
                return r

            },
        },
        methods:{
        },
        created(){
        }
    }
</script>
