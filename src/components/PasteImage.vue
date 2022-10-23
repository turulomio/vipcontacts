<!--
    Returns a js object with base64 image, mame and jsimage
-->

<template>
    <div>
        <v-text-field @paste="pasteFunction" autofocus :placeholder="$t('Press Ctrl-V to paste an image')"></v-text-field>
        <v-img  contain width="200" height="200" :src="new_image.jsimage"></v-img> 
    </div>

</template>

<script>
    export default {
        data () {
            return {
                new_image:{
                    image: null,
                    mime:null,
                    jsimage:null, //String with mime
                },
            }
        },
        methods:{
            async pasteFunction(pasteEvent, callback){

                console.log(pasteEvent.clipboardData)
                if(pasteEvent.clipboardData == false){
                    if(typeof(callback) == "function"){
                        console.log('Undefined ')
                        callback(undefined);
                    }
                }

                var items = pasteEvent.clipboardData.items

                if(items == undefined){
                    if(typeof(callback) == "function"){
                        callback(undefined)
                        console.log('Undefined 2')
                    }
                }
                for (var i = 0; i < items.length; i++) {
                    
                    if (items[i].type.indexOf("image") == -1) continue
                    var blob = items[i].getAsFile()
                    this.new_image= await this.addImage(blob)
                    console.log(this.new_image)
                    this.$emit('input',this.new_image)
                }
            },
            addImage(file){
                return new Promise((resolve, reject) => {
                    var reader = new FileReader();

                    reader.onload = function() {
                        const result=reader.result
                        var r={
                            jsimage: result,
                            image: result.split(",")[1],
                            mime: result.split(";base64,")[0].split(":")[1],
                        }
                        return resolve(r)

                    }
                    reader.onerror=function(error){
                        return reject(error)
                    }

                    reader.readAsDataURL(file)
                })

            },
        },
    }
</script>
