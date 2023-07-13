<template>
    <div class="sidebar__wrap" id="sidebar-satellite">  
        <div class="sidebar__heading">
            <div class="sidebar__title" id="sidebar__prj-title-satellite">
                <i class="mdi mdi-satellite-variant"></i>
                <span class="sidebar--title">SATELLITE</span>
            </div>
        </div>
    
        <div class="sidebar__overview">
            <h3 class="sidebar__overview-title fs-14">
                Click on map to select location
            </h3>
    
            <div class="satellite-sector-container mb-2">
                <div class="mb-3">
                    <div class="mb-1">
                        <span class="satellite-title">Sattelite</span>
                        <span><i class="mdi mdi-information-outline text-info fs-15 fw-semibold"></i></span>
                    </div>
                    <select class="form-select">
                        <option>LANDSAT</option>
                        <option>SENTINEL - 1</option>
                        <option selected="">SENTINEL - 2</option>
                        <option>MODIS</option>
                    </select>
                </div>
                <div class="mb-3">
                    <div class="mb-1">
                        <span class="satellite-title">Date</span>
                        <span><i class="mdi mdi-information-outline text-info fs-15 fw-semibold"></i></span>
                    </div>
                    <div class="d-flex">
                        <select class="form-select px-2" style="width: 43%">
                            <option>1 day</option>
                            <option>1 week</option>
                            <option selected="">1 months</option>
                            <option>6 months</option>
                            <option>12 months</option>
                        </select>
                        <span class="fs-11 mx-1 align-self-center">before</span>
                        <input type="date" class="form-control w-50 px-2">
                    </div>
                    <p class="fs-12 mt-2">Available range: <span>January 1, 2017</span> - <span>Present</span></p>
                </div>
                <div class="mb-3">
                    <div class="mb-1">
                        <span class="satellite-title">Maximum Cloud Cover</span>
                        <span><i class="mdi mdi-information-outline text-info fs-15 fw-semibold"></i></span>
                    </div>
                    <div>
                        <input type="range" class="form-range">
                        <div class="d-flex justify-content-between fs-11 text-muted">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm w-100 mb-3" data-bs-toggle="collapse" data-bs-target="#collapseSattelite" aria-expanded="false" aria-controls="collapseSattelite">APPLY</button>
                <div class="collapse" id="collapseSattelite">
                    <div class="mb-3">
                        <div class="mb-1">
                            <span class="satellite-title">Available Imagery</span>
                            <span><i class="mdi mdi-information-outline text-info fs-15 fw-semibold"></i></span>
                        </div>
                        
                    </div>
                </div>
            </div>
            <a href="#" class="text-decoration-underline text-info fs-12">Powered by Google Earth Engine</a>
        </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        }
    }

</script>