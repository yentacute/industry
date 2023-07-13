<template>
    <vm-offcanvas :offcanvasID="off_table_ID" offcanvas_type="offcanvas-bottom" heading="Dữ liệu">
        <template v-slot:head_center>
            <button class="drag_btn"></button>
        </template>     
        <div class="p-2">
            <div class="row g-2">
                <div class="col-sm">
                    <div>
                        <div class="search-box ms-2">
                            <input type="text" class="form-control" placeholder="Tìm kiếm...">
                            <i class="ri-search-line search-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="col-sm-auto">
                        <select class="form-select">
                        <option selected>Lọc</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div class="col-sm">
                    <div class="d-flex justify-content-sm-end">
                        <ul class="pagination pagination-separated">
                            <li class="page-item disabled">
                                <a href="#" class="page-link">←</a>
                            </li>
                            <li class="page-item">
                                <a href="#" class="page-link">1</a>
                            </li>
                            <li class="page-item active">
                                <a href="#" class="page-link">2</a>
                            </li>
                            <li class="page-item">
                                <a href="#" class="page-link">3</a>
                            </li>
                            <li class="page-item">
                                <a href="#" class="page-link">4</a>
                            </li>
                            <li class="page-item">
                                <a href="#" class="page-link">5</a>
                            </li>
                            <li class="page-item">
                                <a href="#" class="page-link">→</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div data-simplebar class="h-75">
            <table class="table table-nowrap mb-0">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>William Elmore</td>
                        <td>07 Oct, 2021</td>
                        <td>$24.05</td>
                        <td><span class="badge bg-success">Paid</span></td>
                        <td>
                            <button type="button" class="btn btn-sm btn-light">Details</button>
                        </td>
                    </tr>
                    <tr>
                        <td>William Elmore</td>
                        <td>07 Oct, 2021</td>
                        <td>$24.05</td>
                        <td><span class="badge bg-success">Paid</span></td>
                        <td>
                            <button type="button" class="btn btn-sm btn-light">Details</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </vm-offcanvas>
</template>

<script>
    import OffCanvasComponent from "./module/OffCanvasComponent";
    export default {
        components: {
            'vm-offcanvas': OffCanvasComponent
        },

        data() {
            return {
                url_site: '',
                off_table_ID: 'offcanvasTable',
            }
        },

        mounted() {
            this.url_site = window.location.href;
            var ele = document.querySelector('.drag_btn');
            ele.addEventListener("mousedown", this.eleMouseDown, false);
        },

        methods: {
            eleMouseDown: function () {
             document.addEventListener("mousemove", this.eleMouseMove, false);
            },
            eleMouseMove: function (ev) {
                var pY = ev.pageY;
                var ele = document.getElementById("offcanvasTable");
                ele.style.top = pY + "px";
                document.addEventListener("mouseup", this.eleMouseUp, false);
                let totalHeight = window.innerHeight + pY;
                var test2 = totalHeight.toString();
                test2 = test2 + "px";
                document.getElementById("offcanvasTable").style.height = test2;
            },
            eleMouseUp: function () {
                document.removeEventListener("mousemove", this.eleMouseMove, false);
                document.removeEventListener("mouseup", this.eleMouseUp, false);
            }
        }
    }
</script>