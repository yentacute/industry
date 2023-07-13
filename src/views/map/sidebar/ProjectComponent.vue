<template>
    <div class="sidebar__wrap" id="sidebar-project">
    <div class="sidebar__search">
        <input type="text" placeholder="Search Projects">
        <button><i class="mdi mdi-close"></i></button>
    </div>

    <div class="sidebar__heading">
        <div class="sidebar__title">
            <i class="mdi mdi-map-marker"></i>
            <span class="sidebar--title">PROJECTS</span>
        </div>
        <div class="sidebar__filter">
            <span>FILTERS</span>
        </div>
    </div>

    <div class="sidebar__overview">
        <h3 class="sidebar__overview-title">
            Global Overview
        </h3>

        <div class="sidebar__overview-data">
            <ul>
                <li>
                    <span>Projects</span>
                    <strong>2,819</strong>
                </li>

                <li>
                    <span>Com. Amt</span>
                    <strong>2,819</strong>
                </li>

                <li>
                    <span>Locations</span>
                    <strong>2,819</strong>
                </li>

                <li>
                    <span>Countries</span>
                    <strong>2,819</strong>
                </li>
            </ul>
        </div>
    </div>

    <div class="sidebar__status">
        <span class="small--title">Project Status</span>

        <ul>
            <li>
                <input type="checkbox">
                <span>Active</span>
            </li>
            <li>
                <input type="checkbox">
                <span>Closed</span>
            </li>
            <li>
                <input type="checkbox">
                <span>Dropped</span>
            </li>
            <li>
                <input type="checkbox">
                <span>Pipeline</span>
            </li>
        </ul>
    </div>

    <div class="sidebar__region">
        <span class="small--title">Regions</span>

        <div class="sidebar__region-tabs">
            <ul class="nav nav-tabs-custom mb-3" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#project" role="tab">
                        project
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#amount" role="tab">
                        amount
                    </a>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content text-muted">
            <div class="tab-pane active" id="project" role="tabpanel">
                <ul>
                    <li>
                        <span class="badge badge-secondary">1</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                    <li>
                        <span class="badge badge-secondary">2</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                    <li>
                        <span class="badge badge-secondary">3</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                </ul>
            </div>

            <div class="tab-pane" id="amount" role="tabpanel">
                <ul>
                    <li>
                        <span class="badge badge-secondary">1</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                    <li>
                        <span class="badge badge-secondary">2</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                    <li>
                        <span class="badge badge-secondary">3</span>
                        <span>1Eastern And Southern Afri..</span>
                        <span class="badge-number">658</span>

                    </li>
                </ul>
            </div>
            
        </div>
        </div>
    </div>

    <div class="sidebar__sectors">
        <span class="small--title">Sectors</span>

        <div class="sidebar__region-tabs">
            <ul class="nav nav-tabs-custom mb-3" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#project" role="tab">
                        project
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#amount" role="tab">
                        amount
                    </a>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content text-muted">
                <div class="tab-pane active" id="project" role="tabpanel">
                    <ul>
                        <li>
                            <span class="badge badge-secondary">1</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span class="badge-number">658</span>

                        </li>
                        <li>
                            <span class="badge badge-secondary">2</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span class="badge-number">658</span>

                        </li>
                        <li>
                            <span class="badge badge-secondary">3</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span class="badge-number">658</span>
                        </li>
                    </ul>
                </div>

                <div class="tab-pane" id="amount" role="tabpanel">
                    <ul>
                        <li>
                            <span class="badge badge-secondary">1</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span class="badge-number">658</span>
                        </li>
                        <li>
                            <span class="badge badge-secondary">2</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span>658</span>
                        </li>
                        <li>
                            <span class="badge badge-secondary">3</span>
                            <span>1Eastern And Southern Afri..</span>
                            <span>658</span>
                        </li>
                    </ul>
                </div>
            
        </div>
        </div>
    </div>
    </div>
</template>

<script>
    export default {
        name: 'ProjectComponent',
        data() {
            return {
                
            }
        }
    }

</script>