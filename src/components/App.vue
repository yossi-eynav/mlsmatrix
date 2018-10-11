<template>
    <div id="dashboard">
        <el-button type="primary" :loading="loading" icon="el-icon-refresh" v-on:click="toggleAutoRefresh">Hide irrelevant results</el-button>
        <el-button type="warning" v-on:click="restoreAll">Restore All</el-button>
    </div>
</template>

<script>
    const { getResultSize, getResultImagesCount, getResultBeds, getResultBathrooms,getResultPrice,findResults } = require('../lib/DOMQueries');

    module.exports = {
        data: function () {
            return {
                loading: false,
                autoRefreshing: false,
                searchQuery: {}
            }
        },
        created: function() {
            chrome.storage.sync.get('searchQuery', (result) => {
                console.info(result)
                this.searchQuery = Object.assign({}, result.searchQuery);
            });

        },
        methods: {
            toggleAutoRefresh: function() {
                if(this.autoRefreshing) {
                    clearInterval(this.refreshInterval);
                    this.autoRefreshing = false;
                } else {
                    this.refreshInterval = setInterval(() => {
                        this.hideResults();
                    },5000);

                    this.autoRefreshing = true;
                    this.hideResults();
                }
            },
            restureResult: e => {
               window.requestAnimationFrame(() => {
                   e.style.filter = 'blur(0px)';
                   e.style.opacity = 1;
                   e.style.cursor =  'initial';
               })
            },
            disableResult: (e) => {
                window.requestAnimationFrame(() => {
                    e.style.filter = 'blur(4px)';
                    e.style.opacity = 0.6;
                    e.style.cursor =  'not-allowed';
                });

            },
            restoreAll: function(){
                if(this.autoRefreshing) {
                    this.toggleAutoRefresh();
                }
                let results = findResults() || [];

                results = Array.from(results);
                results.forEach((e) => {
                    this.restureResult(e);
                })
            },
            hideResults: function () {
                this.loading = true;
                let results = findResults() || [];

                const {price, beds, baths, images, lotSize} = this.searchQuery;

                results = Array.from(results).filter((elm) => {
                    debugger;
                    const resultPrice = getResultPrice(elm);
                    if(Array.isArray(price) && (resultPrice > price[1] || resultPrice < price[0])) {
                        return true;
                    }

                    const ResultBeds = getResultBeds(elm);
                    if(ResultBeds && ResultBeds < beds) { return true; }

                    const ResultBaths = getResultBathrooms(elm);
                    if(ResultBaths && ResultBaths < baths) { return true; }

                    const ResultImagesCount = getResultImagesCount(elm);
                    if(ResultImagesCount && (ResultImagesCount.max < images)) { return true; }

                    const resultSize = getResultSize(elm);
                    if(Array.isArray(lotSize) && (resultSize > lotSize[1] || resultSize < lotSize[0])) { return true; }

                    return false;
                });

                results.forEach((element) => {
                    this.disableResult(element)
                });

                setTimeout(() => {
                    this.loading = false;
                }, 2000)
            }
        }
    }
</script>

<style scoped>
    #dashboard {
        position: absolute;
        z-index: 10000;
        width: 200px;
        right: 20px;
        bottom: 20px;
        display: flex;
        flex-flow: column;
        align-content: center;
        justify-content: flex-end;
    }

    .el-button {
        margin-bottom: 10px;
        margin-left: 0;
    }

</style>