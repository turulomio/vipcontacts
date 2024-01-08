<template>
    <div v-show="useStore().logged">
        <div class="pa-3">
            <h1>{{ $t("Statistics") }}</h1>

            <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                <v-tab key="Gender"><v-icon small style="margin:6px">mdi-gender-male</v-icon>{{ $t("Gender")}}</v-tab>
                <v-tab key="Jobs"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Jobs")}}</v-tab>
                <v-tab key="Countries"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Countries")}}</v-tab>
                <v-tab key="Cities"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Cities")}}</v-tab>
                <v-tab key="Registers"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Registers")}}</v-tab>

                <v-tabs-slider color="yellow"></v-tabs-slider>
            </v-tabs>
            <v-tabs-items v-model="tab" v-if="statistics">
                <v-tab-item key="Gender">
                    <v-card flat>
                      <chart-pie :name="$t('Gender')" :items="statistics.gender" :key="key"></chart-pie>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="Jobs">
                    <v-card flat>
                      <chart-pie :name="$t('Jobs')" :items="statistics.jobs" :key="key"></chart-pie>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="Countries">
                    <v-card flat>
                      <chart-pie :name="$t('Countries')" :items="statistics.countries" :key="key"></chart-pie>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="Cities">
                    <v-card flat>
                      <chart-pie :name="$t('Cities')" :items="statistics.cities" :key="key"></chart-pie>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="Registers">
                    <v-card flat>
                      <chart-pie :name="$t('Vip Contacts registers')" :items="statistics.registers" :key="key"></chart-pie>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    import ChartPie from './reusing/ChartPie.vue'
    import { useStore } from '@/store';
    import axios from "axios"
    export default {
        name: 'Statistics',
        components: {
            ChartPie,
        },
        data () {
            return {
                statistics:null,
                key:0,
                tab:0,
            }
        },
        methods: {
            useStore,
            getStatistics(){
                axios.get(`${this.useStore().apiroot}/api/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.statistics=response.data 
                    console.log(this.statistics)
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
