<template>
    <div class="popup">
        <header>
         <img src="" alt="logo"/>
        </header>

        <form>
            <div>
                <strong>Price</strong>
                <div class="container-input">
                    <el-slider v-model="searchQuery.price" range :format-tooltip="formatToDollars" :step="1000" :max="200000" :min="10000"></el-slider>
                </div>
            </div>
            <!--<div>-->
                <!--<strong>Beds</strong>-->
                <!--<div class="container-input">-->
                    <!--<el-input-number v-model="searchQuery.beds" :min="1" :max="10"></el-input-number>-->

                <!--</div>-->
            <!--</div>-->
            <!--<div>-->
                <!--<strong>Baths</strong>-->
                <!--<div class="container-input">-->
                    <!--<el-input-number v-model="searchQuery.baths" :min="1" :max="10"></el-input-number>-->

                <!--</div>-->
            <!--</div>-->
            <div>
                <strong>Minimun Images</strong>
                <div class="container-input">
                    <el-input-number v-model="searchQuery.images" :min="1" :max="100"></el-input-number>
                </div>
            </div>
            <div>
                <strong>Lot size (ft.)</strong>
                <div class="container-input">
                    <el-slider v-model="searchQuery.lotSize" :format-tooltip="formatToFt" range :max="4000" :min="100"></el-slider>
                </div>
            </div>

            <div>
                <el-button type="primary"  v-on:click="applyFilters">Apply Results</el-button>
            </div>
        </form>


        <footer>

        </footer>
    </div>
</template>

<script>

    module.exports = {
        data: function () {
            return {
                searchQuery: {
                    price: null,
                    // beds: null,
                    // baths: null,
                    images: null,
                    lotSize: null
                }
            }
        },
        methods: {
            formatToDollars: function(val) {
                return `${val}$`;
            },
            formatToFt: function(val) {
                return `${val} ft`
            },
            applyFilters: function() {
                chrome.storage.sync.set({
                    searchQuery: this.searchQuery
                });
                chrome.tabs.reload();
            }
        },
        created: function () {
            // `this` points to the vm instance
           chrome.storage.sync.get(['searchQuery'], (data) => {
               if(!data.searchQuery) { return; }
                console.info('fetched from cache:', data.searchQuery);

               this.searchQuery = Object.assign({}, data.searchQuery);
            });

        },
        watch: {
            // searchQuery: {
            //     handler: function(val) {
            //         chrome.storage.sync.set({
            //             searchQuery: val
            //         });
            //         console.info(val);
            //     },
            //     deep: true
            // }
        }

    }
</script>

<style scoped>
    .popup {
        width: 370px;
        display: flex;
        flex-flow: column;
        align-content: center;
        justify-content: flex-end;
        padding: 15px;
        box-sizing: border-box;
    }

    form > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }

    .container-input {
        min-width: 210px;
    }
</style>