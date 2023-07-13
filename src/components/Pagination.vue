<template>
    <div class="d-flex justify-content-end mt-3">
        <div class="pagination-wrap hstack gap-2">
            <b-link class="page-item pagination-prev" v-if="showPrevious()" :class="[liClass, { 'disabled' : currentPage <= 1 }]">
                <a class="page-link" href="#" v-if="currentPage <= 1">
                    <span aria-hidden="true">{{ config.previousText }}</span>
                </a>
                <a class="page-link" href="#" v-if="currentPage > 1 " :aria-label="config.ariaPrevious" @click.prevent="changePage(currentPage - 1)">
                    <span aria-hidden="true">{{ config.previousText }}</span>
                </a>
            </b-link>

            <ul class="pagination listjs-pagination mb-0" >
                <li v-for="num in array" :class="[liClass, { 'active': num === currentPage }]">
                    <a class="page" href="#" @click.prevent="changePage(num)">{{ num }}</a>
                </li>
            </ul>

            <b-link class="page-item pagination-next" href="#" v-if="showNext()" :class="[liClass, { 'disabled' : currentPage === lastPage || lastPage === 0 }]">
                <a class="page-link" href="#" v-if="currentPage === lastPage || lastPage === 0">
                    <span aria-hidden="true">{{ config.nextText }}</span>
                </a>
                <a class="page-link" href="#" v-if="currentPage < lastPage" :aria-label="config.ariaNext" @click.prevent="changePage(currentPage + 1)">
                    <span aria-hidden="true">{{ config.nextText }}</span>
                </a>
            </b-link>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            total: {
                type: Number,
                required: true
            },
            pageSize: {
                type: Number,
                required: true
            },
            callback: {
                type: Function,
                required: true
            },
            options: {
                type: Object
            },
            navClass:{
                type: String,
                default: ""
            },
            ulClass:{
                type: String,
                default: ""
            },
            liClass:{
                type: String,
                default: ""
            }
        },

        data() {
            return { currentPage: 1 }
        },
        computed: {
            _total() { return this.total },
            _pageSize() { return this.pageSize },
            lastPage() {
                let _total = this._total / this._pageSize;
                if (_total < 1)
                    return 1;

                if (_total % 1 != 0)
                    return parseInt(_total + 1);

                return _total;
            },
            array() {

                let _from = this.currentPage - this.config.offset;
                if (_from < 1)
                    _from = 1;

                let _to = _from + (this.config.offset * 2);
                if (_to >= this.lastPage)
                    _to = this.lastPage;

                let _arr = [];
                while (_from <= _to) {
                    _arr.push(_from);
                    _from++;
                }

                return _arr;
            },
            config() {
                return Object.assign({
                    offset: 2,
                    previousText: 'Trước',
                    nextText: 'Sau',
                    alwaysShowPrevNext: true
                }, this.options);
            }
        },
        methods: {
            showPrevious() {
                return this.config.alwaysShowPrevNext || this.currentPage > 1;
            },
            showNext() {
                return this.config.alwaysShowPrevNext || this.currentPage < this.lastPage;
            },
            changePage(page) {
                if (this.currentPage === page) return;
                this.currentPage = page;
                this.callback(page);
            }
        }
    }

</script>