<template>
    <div v-show="useStore().logged">
        <div  class="pa-3">
            <h1>{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-card class="mx-auto padding" max-width="40%">
                    <v-card-title>{{ $t("Select your envelope size")}}</v-card-title>
                    <v-text-field v-model="envelope_width" type="number" :label="$t('Envelope width')" :placeholder="$t('Enter a number')" :suffix="$t('cm')" :rules="RulesInteger(5,true)"></v-text-field>
                    <v-text-field v-model="envelope_height" type="number" :label="$t('Envelope height')" :placeholder="$t('Enter a number')" :suffix="$t('cm')" :rules="RulesInteger(5,true)"></v-text-field>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn data-test="Settings_Button" color="primary" @click="save_settings()" :disabled="!form_valid">{{ $t("Save settings")}}</v-btn>
                        <v-btn color="error" @click="$router.push({name: 'home'})">{{ $t("Cancel")}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </div>
    </div>
</template>

<script>
    import { useStore } from '@/store';
    import { RulesInteger } from 'vuetify_rules';
    export default {
        name: 'Settings',
        data () {
            return {
                form_valid: true,
                envelope_height: 11,
                envelope_width: 22,

            }
        },
        methods: {
            useStore,
            RulesInteger,
            save_settings(){
            if (this.$refs.form.validate()==false) return
                localStorage.envelope_height=this.envelope_height
                localStorage.envelope_width=this.envelope_width
                this.$router.push({name: "home"})
            }
        },
        mounted(){
            if (localStorage.envelope_height) this.envelope_height=localStorage.envelope_height
            if (localStorage.envelope_width) this.envelope_width=localStorage.envelope_width
        }
    }
</script>
