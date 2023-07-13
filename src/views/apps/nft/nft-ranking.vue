<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";

export default {
    data() {
        return {
            title: "Ranking",
            items: [{
                text: "NFT Marketplace",
                href: "/",
            },
            {
                text: "Ranking",
                active: true,
            },
            ],

            page: 1,
            perPage: 10,
            pages: [],
            searchQuery: null,
            rankinglist: [
                {
                    ranking: 1,
                    img: require("@/assets/images/nft/img-01.jpg"),
                    collection: "Abstract Face Painting",
                    volume_price: "7,50,000",
                    hours: 342.35,
                    day: 312.35,
                    item: "10k",
                    floor_price: "33.02",
                },
                {
                    ranking: 2,
                    img: "https://img.themesbrand.com/velzon/images/img-1.gif",
                    collection: "Patterns Arts & Culture",
                    volume_price: "32,850",
                    hours: -42.03,
                    day: 20.14,
                    item: "8k",
                    floor_price: "74.69",
                },
                {
                    ranking: 3,
                    img: require("@/assets/images/nft/img-02.jpg"),
                    collection: "Creative Filtered Portrait",
                    volume_price: "1,36,000",
                    hours: 170.31,
                    day: -415.21,
                    item: "15k",
                    floor_price: "67.16",
                },
                {
                    ranking: 4,
                    img: "https://img.themesbrand.com/velzon/images/img-2.gif",
                    collection: "Long-tailed Macaque",
                    volume_price: "3,63,000",
                    hours: 709.13,
                    day: -645.1,
                    item: "21k",
                    floor_price: "137.09",
                },
                {
                    ranking: 5,
                    img: require("@/assets/images/nft/img-04.jpg"),
                    collection: "Robotic Body Art",
                    volume_price: "25,800",
                    hours: -347.42,
                    day: -321.17,
                    item: "17k",
                    floor_price: "343.75",
                },
                {
                    ranking: 6,
                    img: require("@/assets/images/nft/img-06.jpg"),
                    collection: "Smillevers Crypto",
                    volume_price: "37,100",
                    hours: 1.42,
                    day: 0.64,
                    item: "31k",
                    floor_price: "1.87",
                },
                {
                    ranking: 7,
                    img: "https://img.themesbrand.com/velzon/images/img-3.gif",
                    collection: "The Chirstoper",
                    volume_price: "1,87,600",
                    hours: -31.49,
                    day: 26.07,
                    item: "18k",
                    floor_price: "101.12",
                },
                {
                    ranking: 8,
                    img: "https://img.themesbrand.com/velzon/images/img-3.gif",
                    collection: "Walking On Air",
                    volume_price: "4,62,000",
                    hours: 238.13,
                    day: 183.4,
                    item: "8.3k",
                    floor_price: "143.39",
                },
                {
                    ranking: 9,
                    img: "https://img.themesbrand.com/velzon/images/img-5.gif",
                    collection: "The Chirstoper",
                    volume_price: "74,950",
                    hours: -31.49,
                    day: -26.07,
                    item: "7.9k",
                    floor_price: "101.12",
                },
                {
                    ranking: 10,
                    img: require("@/assets/images/nft/img-03.jpg"),
                    collection: "Walking On Air",
                    volume_price: "3,35,750",
                    hours: 238.13,
                    day: -64.3,
                    item: "8.3k",
                    floor_price: "143.39",
                },
                {
                    ranking: 11,
                    img: require("@/assets/images/nft/img-04.jpg"),
                    collection: "Highstreet IHO Part",
                    volume_price: "35,750",
                    hours: 23.1,
                    day: -64.36,
                    item: "12.3k",
                    floor_price: "367.39",
                },
            ],
        };
    },
    computed: {
        displayedPosts() {
            return this.paginate(this.rankinglist);
        },
        resultQuery() {
            if (this.searchQuery) {
                const search = this.searchQuery.toLowerCase();
                return this.displayedPosts.filter((data) => {
                    return (
                        data.collection.toLowerCase().includes(search)
                    );
                });
            } else {
                return this.displayedPosts;
            }
        },
    },
    watch: {
        posts() {
            this.setPages();
        },
    },
    created() {
        this.setPages();
    },
    components: {
        Layout,
        PageHeader,
    },
    methods: {
        setPages() {
            let numberOfPages = Math.ceil(this.rankinglist.length / this.perPage);
            for (let index = 1; index <= numberOfPages; index++) {
                this.pages.push(index);
            }
        },
        paginate(rankinglist) {
            let page = this.page;
            let perPage = this.perPage;
            let from = page * perPage - perPage;
            let to = page * perPage;
            return rankinglist.slice(from, to);
        },

    },
    mounted() {

    },
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <b-row>
            <b-col lg="12">
                <b-card no-body id="contactList">
                    <b-card-header>
                        <div class="d-flex align-items center">
                            <h5 class="mb-0 flex-grow-1">The top NFTs ranking on Velzon</h5>
                            <p class="text-muted mb-0">Updated: 28 April, 2022 08:05:00</p>
                        </div>
                    </b-card-header>
                    <b-card-body>
                        <b-row class="justify-content-between g-3">
                            <b-col xxl="3" sm="6">
                                <div class="search-box">
                                    <input type="text" class="form-control search" placeholder="Search for ..."
                                        v-model="searchQuery">
                                    <i class="ri-search-line search-icon"></i>
                                </div>
                            </b-col>
                            <b-col xxl="2" sm="4">
                                <div>
                                    <select class="form-control" data-choices data-choices-search-false
                                        name="choices-single-default" id="idStatus">
                                        <option value="All Time" selected>All Time</option>
                                        <option value="1 Day">1 Day</option>
                                        <option value="7 Days">7 Days</option>
                                        <option value="15 Days">15 Days</option>
                                        <option value="1 Month">1 Month</option>
                                        <option value="6 Month">6 Month</option>
                                    </select>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card-body>
                    <b-card-body>
                        <div class="table-responsive table-card">
                            <table class="table align-middle table-nowrap table-hover" id="customerTable">
                                <thead class="table-light text-muted">
                                    <tr>
                                        <th class="sort" data-sort="ranking" scope="col" style="width: 98px;">Ranking
                                        </th>
                                        <th class="sort" data-sort="collection" scope="col">Collection</th>
                                        <th class="sort" data-sort="volume_price" scope="col">Volume (USD)</th>
                                        <th class="sort" data-sort="24h" scope="col">24h%</th>
                                        <th class="sort" data-sort="7d" scope="col">7d%</th>
                                        <th class="sort" data-sort="item" scope="col">Item</th>
                                        <th class="sort" data-sort="floor-price" scope="col">Floor Price</th>
                                    </tr>
                                </thead>
                                <tbody class="list form-check-all">
                                    <tr v-for="(data, index) of resultQuery" :key="index">
                                        <td class="ranking " :class="data.ranking <= 3 && 'text-info fw-semibold'">
                                            #{{ data.ranking }}
                                        </td>
                                        <td class="collection">
                                            <div class="d-flex align-items-center">
                                                <img :src="data.img" alt=""
                                                    class="avatar-xs rounded-circle object-cover me-2">
                                                <b-link href="/apps/nft-item-detail" class="link-dark"> {{ data.collection
                                                }}</b-link>
                                            </div>
                                        </td>
                                        <td class="volume_price">{{ data.volume_price }}</td>
                                        <td>
                                            <h6 class=" mb-1 24h " :class="data.hours > 0 ? 'text-success' : 'text-danger'">
                                                {{ data.hours }} ETH</h6>
                                        </td>
                                        <td>
                                            <h6 class="mb-1 7d " :class="data.day > 0 ? 'text-success' : 'text-danger'"> {{
                                                data.day }} ETH</h6>
                                        </td>
                                        <td class="item">{{ data.item }}</td>
                                        <td class="floor-price">{{ data.floor_price }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="noresult" style="display: none">
                                <div class="text-center">
                                    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop"
                                        colors="primary:#405189,secondary:#0ab39c" style="width:75px;height:75px">
                                    </lord-icon>
                                    <h5 class="mt-2">Sorry! No Result Found</h5>
                                    <p class="text-muted mb-0">We've searched more than 150+ transactions We did not
                                        find any transactions for you search.</p>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end mt-3">
                            <div class="pagination-wrap hstack gap-2">
                                <b-link class="page-item pagination-prev" href="#" v-if="page != 1" @click="page--">
                                    Previous
                                </b-link>
                                <ul class="pagination listjs-pagination mb-0">
                                    <li :class="{
                                        active: pageNumber == page,
                                        disabled: pageNumber == '...',
                                    }" v-for="(pageNumber, index) in pages" :key="index" @click="page = pageNumber">
                                        <b-link class="page" href="#">{{ pageNumber }}</b-link>
                                    </li>
                                </ul>
                                <b-link class="page-item pagination-next" href="#" @click="page++"
                                    v-if="page < pages.length">
                                    Next
                                </b-link>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </Layout>
</template>