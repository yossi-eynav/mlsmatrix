<template>
    <div id="dashboard">
        <el-button :disabled="restoreBtnDisabled" type="warning" v-on:click="restoreAll">Restore All Results {{hidingCounter ? `(Hiding ${hidingCounter} Items)`: ''}}</el-button>
    </div>
</template>

<script>
    const { getResultSize, getResultImagesCount, getResultBeds, getResultBathrooms,getResultPrice,findResults, getResultTitle } = require('../lib/DOMQueries');

    module.exports = {
        data: function () {
            return {
                loading: false,
                autoRefreshing: false,
                restoreBtnDisabled: false,
                hidingCounter: 0,
                searchQuery: {}
            }
        },
        created: function() {
            chrome.storage.sync.get('searchQuery', (result) => {
                console.info(result);
                this.searchQuery = Object.assign({}, result.searchQuery);
                this.toggleAutoRefresh();
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
                   e.style.display = 'block';
               })
            },
            disableResult: (e) => {
                window.requestAnimationFrame(() => {
                    e.style.display = 'none';
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
                });
                this.hidingCounter = 0;
                this.restoreBtnDisabled = true;
            },
            hideResults: function () {
                this.loading = true;
                let results = findResults() || [];

                const {price, images, lotSize} = this.searchQuery;
                console.group();
                results = Array.from(results).filter((elm) => {
                    const resultPrice = getResultPrice(elm);
                    const ResultImagesCount = getResultImagesCount(elm);
                    const resultSize = getResultSize(elm);
                    const resultTitle = getResultTitle(elm);

                    console.table([
                        ['resultTitle', resultTitle],
                        ['resultPrice', resultPrice],
                        ['ResultImagesCount', ResultImagesCount],
                        ['resultSize', resultSize],
                    ]);

                    if(Array.isArray(price) && (resultPrice > price[1] || resultPrice < price[0])) {
                        return true;
                    }

                    if(!ResultImagesCount || (ResultImagesCount.max < images)) { return true; }
                    if(Array.isArray(lotSize) && (resultSize > lotSize[1] || resultSize < lotSize[0])) { return true; }

                    return false;
                });
                console.groupEnd();

                results.forEach((element) => {
                    if(element.style.display !== 'none') {
                        this.hidingCounter++;
                        this.disableResult(element)
                    }
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
        width: 300px;
        right: 20px;
        top: 20px;
        display: flex;
        flex-flow: column;
        align-content: center;
        justify-content: flex-end;
    }

    .el-button {
        margin-top: 10px;
        margin-left: 0;
    }

</style>