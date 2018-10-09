<template>
    <div id="dashboard">
        <el-button type="success" :loading="loading" v-on:click="hideResults">Hide irrelevant results</el-button>
        <el-button type="primary" icon="el-icon-refresh" v-on:click="toggleAutoRefresh">{{autoRefreshing ? 'Turn off auto refresh': 'Auto refresh' }}</el-button>
        <el-button type="warning" v-on:click="restoreAll">Restore All</el-button>
    </div>
</template>

<script>
    const { getResultSize, getResultImagesCount, getResultBeds, getResultBathrooms,getResultPrice,findResults } = require('../lib/DOMQueries');
    const { Rule } = require('../models/Rule');

    module.exports = {
        data: function () {
            return {
                loading: false,
                autoRefreshing: false
            }
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
                }
            },
            disableResult: (e) => {
                e.style.filter = 'blur(4px)';
                e.style.opacity = 0.6;
                e.style.cursor =  'not-allowed';
            },
            restoreAll: function(){
                if(this.autoRefreshing) {
                    this.toggleAutoRefresh();
                }
                let results = findResults() || [];

                results = Array.from(results);
                results.forEach((e) => {
                    e.style.filter = 'blur(0px)';
                    e.style.opacity = 1;
                    e.style.cursor =  'initial';
                })
            },
            hideResults: function () {
                this.loading = true;
                let results = findResults() || [];

                results = Array.from(results).filter((elm) => {
                    const price = getResultPrice(elm);
                    return price < 59900;
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