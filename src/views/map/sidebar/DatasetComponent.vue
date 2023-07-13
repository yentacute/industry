
<template>
    <div class="sidebar__wrap" id="sidebar-datasets">
        <div class="sidebar__search">
            <input type="text" placeholder="Search Datasets">
            <button><i class="mdi mdi-close"></i></button>
        </div>

        <div class="sidebar__heading">
            <div class="sidebar__title">
                <i class="mdi mdi-checkbox-multiple-blank"></i>
                <span class="sidebar--title">DATASETS (1974)</span>
            </div>
        </div>

        <div class="sidebar__dropdown-wrap">
            <div class="sidebar__dropdown-title" :class="{'active' : isActive == true }" @click="toggleDropdown">
                <span>Agriculture & Rural Development (73)</span>
                <i v-if="!isActive" class="mdi mdi-chevron-down"></i>
                <i v-if="isActive" class="mdi mdi-chevron-up"></i>
            </div>

            <div class="dropdown__item-wrap">
                <div class="item">
                    <div class="item__left">
                        <div class="item__left-icon">
                            <i class="mdi mdi-information-outline"></i>
                            <div class="icon__detail">
                                <strong>Name:</strong> Birder Footfall
                                <strong>Source:</strong> The Nature Conservancy
                                <strong>Description:</strong> Estimate of birdwatching effort, based on data uploaded by users of the internationally popular eBird app. Numbers represent birdwatching intensity, with the score being the sum of "observer-day" uploads per 500m grid cell (ie. capturing only one observation per observer per day per cell). Map includes data from Eastern Caribbean countries (Dominica, Grenada, Saint Kitts and Nevis, Saint Lucia, and Saint Vincent and the Grenadines).
                                <strong>Link:</strong> https://services.arcgis.com/F7DSX1DSNSiWmOqh/ArcGIS/rest/services/Bird_watching_03292021_WFL1/FeatureServer/0
                                <strong>Last updated:</strong> 2021
                                <strong>License:</strong> AS IS and AS AVAILABLE basis
                            </div>
                        </div>
                        <span class="item__left-title">
                            Bird Watching - Areas of Conservation Importance Source: The Nature Conservancy
                        </span>
                    </div>

                    <div class="item__right">
                        <span v-if="addIsActive" @click="toggleAddButton">Add</span>
                        <span v-if="!addIsActive" @click="toggleAddButton"><i class="mdi mdi-close"></i></span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isActive: false,
                addIsActive: true
            }
        },

        methods: {
            toggleDropdown: function() {
                this.isActive = !this.isActive;
            },

            toggleAddButton: function() {
                this.addIsActive = !this.addIsActive
            }
        }
    }

</script>