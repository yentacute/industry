<script>
import {
  CountTo
} from "vue3-count-to";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import Swal from "sweetalert2";
import axios from 'axios';
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";

export default {
  page: {
    title: "List",
    meta: [{
      name: "description",
      content: appConfig.description
    }],
  },
  data() {
    return {
      title: "List",
      items: [{
        text: "Tickets",
        href: "/",
      },
      {
        text: "List",
        active: true,
      },
      ],
      modalShow: false,
      rangeDateconfig: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
        mode: "range",
      },
      config: {
        enableTime: false,
        dateFormat: "d M, Y",
      },
      date: null,
      date1: null,
      date2: null,
      filterdate: null,
      filterdate1: null,
      filtervalue: 'All',
      filtervalue1: 'All',
      filtersearchQuery1: null,
      searchQuery: null,
      page: 1,
      perPage: 9,
      pages: [],
      ticketsList: [{
        id: "#VLZ452",
        title: "Error message when placing an orders?",
        client: "Tonya Noble",
        assigned: "James Morris",
        create: "08 Dec, 2021",
        due: "25 Jan, 2022",
        status: "Inprogress",
        priority: "High",
      },
      {
        id: "#VLZ453",
        title: "Issue with finding information about order ?",
        client: "Mary Rucker",
        assigned: "David Nichols",
        create: "24 Oct, 2021",
        due: "20 Dec, 2021",
        status: "New",
        priority: "Low",
      },
      {
        id: "#VLZ454",
        title: "Apologize for shopping Error!",
        client: "Nathan Cole",
        assigned: "Nancy Martino",
        create: "17 Oct, 2021",
        due: "23 Oct, 2021",
        status: "Open",
        priority: "Medium",
      },
      {
        id: "#VLZ455",
        title: "Post launch reminder/ post list",
        client: "Joseph Parker",
        assigned: "Alexis Clarke",
        create: "03 Oct, 2021",
        due: "05 Oct, 2021",
        status: "Closed",
        priority: "High",
      },
      {
        id: "#VLZ456",
        title: "Make a creating an account profile",
        client: "Henry Baird",
        assigned: "David Nichols",
        create: "09 Oct, 2021",
        due: "17 Oct, 2021",
        status: "Inprogress",
        priority: "Medium",
      },
      {
        id: "#VLZ457",
        title: "Change email option process",
        client: "Tonya Noble",
        assigned: "Nancy Martino",
        create: "27 Oct, 2021",
        due: "04 Dec, 2021",
        status: "Open",
        priority: "High",
      },
      {
        id: "#VLZ458",
        title: "User research",
        client: "Donald Palmer",
        assigned: "James Morris",
        create: "05 Oct, 2021",
        due: "11 Oct, 2021",
        status: "New",
        priority: "Low",
      },
      {
        id: "#VLZ459",
        title: "Banner design for FB & Twitter",
        client: "Mary Rucker",
        assigned: "Jennifer Carter",
        create: "09 Dec, 2021",
        due: "16 Dec, 2021",
        status: "Closed",
        priority: "Medium",
      },
      {
        id: "#VLZ460",
        title: "Brand logo design",
        client: "Tonya Noble",
        assigned: "Alexis Clarke",
        create: "24 Dec, 2021",
        due: "29 Dec, 2021",
        status: "Closed",
        priority: "High",
      },
      {
        id: "#VLZ461",
        title: "Additional Calendar",
        client: "Diana Kohler",
        assigned: "David Nichols",
        create: "04 Oct, 2021",
        due: "13 Oct, 2021",
        status: "New",
        priority: "Low",
      },
      {
        id: "#VLZ462",
        title: "Edit customer testimonial",
        client: "Nathan Cole",
        assigned: "Nancy Martino",
        create: "21 Dec, 2021",
        due: "02 Jan, 2021",
        status: "Inprogress",
        priority: "Medium",
      },
      ],
      defaultOptions: {
        animationData: animationData
      },
      defaultOptions1: {
        animationData: animationData1
      },
    };
  },
  components: {
    Layout,
    PageHeader,
    CountTo,
    lottie: Lottie,
    Multiselect,
    flatPickr,
  },
  computed: {
    displayedPosts() {
      return this.paginate(this.ticketsList);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
            data.title.toLowerCase().includes(search) ||
            data.client.toLowerCase().includes(search) ||
            data.assigned.toLowerCase().includes(search) ||
            data.create.toLowerCase().includes(search) ||
            data.due.toLowerCase().includes(search) ||
            data.status.toLowerCase().includes(search) ||
            data.priority.toLowerCase().includes(search)
          );
        });
      } else if (this.filterdate !== null) {
        if (this.filterdate !== null) {
          var date1 = this.filterdate.split(" to ")[0];
          var date2 = this.filterdate.split(" to ")[1];
        }
        return this.displayedPosts.filter((data) => {
          if (
            new Date(data.due.slice(0, 12)) >= new Date(date1) &&
            new Date(data.due.slice(0, 12)) <= new Date(date2)
          ) {
            return data;
          } else {
            return null;
          }
        });
      } else if (this.filtervalue !== null) {
        return this.displayedPosts.filter((data) => {
          if (data.status === this.filtervalue || this.filtervalue == 'All') {
            return data;
          } else {
            return null;
          }
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
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  beforeMount() {
    axios.get('https://api-node.themesbrand.website/apps/ticket').then((data) => {
      this.ticketsList = [];
      data.data.data.forEach((row) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
          "Oct", "Nov", "Dec"
        ];
        var dd = new Date(row.create);
        var due = new Date(row.due);
        row.create = dd.getDate() + " " + monthNames[dd.getMonth()] + ", " + dd.getFullYear();
        row.due = due.getDate() + " " + monthNames[due.getMonth()] + ", " + due.getFullYear();
        this.ticketsList.push(row);
      });
    }).catch((er) => {
      console.log(er);
    });
  },
  methods: {
    SearchData() {
      this.filterdate = this.filterdate1;
      this.filtervalue = this.filtervalue1;
    },
    editdata(data) {
      this.modalShow = true;
      document.getElementById("modal-id").style.display = "block";
      document.querySelector('.exampleModalLabel').innerHTML = "Edit Ticket";
      document.getElementById('orderId').value = data.id;
      document.getElementById('tasksTitle').value = data.title;
      document.getElementById('clientName').value = data.client;
      document.getElementById('assignedtoName').value = data.assigned;
      document.getElementById('cdate').value = data.create;
      document.getElementById('ddate').value = data.due;
      document.getElementById('ticketstatus').value = data.status;
      document.getElementById('priority').value = data.priority;

      document.getElementById('edit-btn').style.display = 'block';
      document.getElementById('add-btn').style.display = 'none';
    },
    updateorder() {
      let result = this.ticketsList.findIndex(o => o.id == document.getElementById('orderId').value);
      this.ticketsList[result].title = document.getElementById('tasksTitle').value;
      this.ticketsList[result].client = document.getElementById('clientName').value;
      this.ticketsList[result].assigned = document.getElementById('assignedtoName').value;
      this.ticketsList[result].create = document.getElementById('cdate').value;
      this.ticketsList[result].due = document.getElementById('ddate').value;
      this.ticketsList[result].status = document.getElementById('ticketstatus').value;
      this.ticketsList[result].priority = document.getElementById('priority').value;
      document.getElementById('closemodal').click();
      axios.patch(`https://api-node.themesbrand.website/apps/ticket/${this.ticketsList[result]._id}`, this.ticketsList[result])
        .then(() => {

        }).catch((er) => {
          console.log(er);
        });
    },
    deletedata(event) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#f46a6a",
        confirmButtonColor: "#34c38f",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.ticketsList.splice(this.ticketsList.indexOf(event), 1);
          axios.delete(`https://api-node.themesbrand.website/apps/ticket/${event._id}`)
            .then(() => {

            }).catch((er) => {
              console.log(er);
            });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    },
    deleteMultiple() {
      let ids_array = [];
      var items = document.getElementsByName("chk_child");
      items.forEach(function (ele) {
        if (ele.checked == true) {
          var trNode = ele.parentNode.parentNode.parentNode;
          var id = trNode.querySelector(".id a").innerHTML;
          ids_array.push(id);
        }
      });
      if (typeof ids_array !== "undefined" && ids_array.length > 0) {
        if (confirm("Are you sure you want to delete this?")) {
          var cusList = this.ticketsList;
          ids_array.forEach(function (id) {
            cusList = cusList.filter(function (orders) {
              return orders.id != id;
            });
          });
          this.ticketsList = cusList;
          document.getElementById("checkAll").checked = false;
          var itemss = document.getElementsByName("chk_child");
          itemss.forEach(function (ele) {
            if (ele.checked == true) {
              ele.checked = false;
              ele.closest("tr").classList.remove("table-active");
            }
          });
        } else {
          return false;
        }
      } else {
        Swal.fire({
          title: "Please select at least one checkbox",
          confirmButtonClass: "btn btn-info",
          buttonsStyling: false,
          showCloseButton: true,
        });
      }
    },
    addorder() {
      var id = '#VLZ4' + this.ticketsList.length + 1;
      var title = document.getElementById('tasksTitle').value;
      var client = document.getElementById('clientName').value;
      var assigned = document.getElementById('assignedtoName').value;
      var create = document.getElementById('cdate').value;
      var due = document.getElementById('ddate').value;
      var status = document.getElementById('ticketstatus').value;
      var priority = document.getElementById('priority').value;

      var data = {
        id: id,
        title: title,
        client: client,
        assigned: assigned,
        create: create,
        due: due,
        status: status,
        priority: priority
      };
      this.ticketsList.push(data);
      axios.post(`https://api-node.themesbrand.website/apps/ticket`, data)
        .then(() => {

        }).catch((er) => {
          console.log(er);
        });

      document.getElementById('closemodal').click();
      document.getElementById("addform").reset();
    },
    addnew() {
      this.modalShow = true
      document.getElementById("addform").reset();
      document.getElementById("modal-id").style.display = "none";
      document.querySelector('.exampleModalLabel').innerHTML = "Add Ticket";
      document.getElementById('add-btn').style.display = 'block';
      document.getElementById('edit-btn').style.display = 'none';
      // this.modalShow = !this.modalShow;
    },
    setPages() {
      let numberOfPages = Math.ceil(this.ticketsList.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(ticketsList) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return ticketsList.slice(from, to);
    },
  },
  mounted() {
    var checkAll = document.getElementById("checkAll");
    if (checkAll) {
      checkAll.onclick = function () {
        var checkboxes = document.querySelectorAll(
          '.form-check-all input[type="checkbox"]'
        );

        if (checkAll.checked == true) {
          checkboxes.forEach(function (checkbox) {
            checkbox.checked = true;
            checkbox.closest("tr").classList.add("table-active");
            document.getElementById('remove-actions').style.display = 'block';
          });
        } else {
          checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
            checkbox.closest("tr").classList.remove("table-active");
            document.getElementById('remove-actions').style.display = 'none';
          });
        }
      };
    }

    var checkboxes = document.querySelectorAll('#ticketsList .form-check-input');
    Array.from(checkboxes).forEach(function (element) {
      element.addEventListener('change', function (event) {
        var checkedCount = document.querySelectorAll('#ticketsList .form-check-input:checked').length;

        if (event.target.closest("tr").classList.contains("table-active")) {
          (checkedCount > 0) ? document.getElementById("remove-actions").style.display = 'block' : document.getElementById("remove-actions").style.display = 'none';
        } else {
          (checkedCount > 0) ? document.getElementById("remove-actions").style.display = 'block' : document.getElementById("remove-actions").style.display = 'none';
        }
      });
    });
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-row>
      <b-col xxl="3" sm="6">
        <b-card no-body class="card-animate">
          <b-card-body>
            <div class="d-flex justify-content-between">
              <div>
                <p class="fw-medium text-muted mb-0">Total Tickets</p>
                <h2 class="mt-4 ff-secondary fw-semibold">
                  <count-to :duration="1000" :startVal="0" :endVal="547"></count-to>k
                </h2>
                <p class="mb-0 text-muted">
                  <b-badge class="bg-light text-success mb-0">
                    <i class="ri-arrow-up-line align-middle"></i> 17.32 %
                  </b-badge>
                  vs. previous month
                </p>
              </div>
              <div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-soft-info text-info rounded-circle fs-4">
                    <i class="ri-ticket-2-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col xxl="3" sm="6">
        <b-card no-body class="card-animate">
          <b-card-body>
            <div class="d-flex justify-content-between">
              <div>
                <p class="fw-medium text-muted mb-0">Pending Tickets</p>
                <h2 class="mt-4 ff-secondary fw-semibold">
                  <count-to :duration="1000" :startVal="0" :endVal="124"></count-to>k
                </h2>
                <p class="mb-0 text-muted">
                  <b-badge class="bg-light text-danger mb-0">
                    <i class="ri-arrow-down-line align-middle"></i> 0.96 %
                  </b-badge>
                  vs. previous month
                </p>
              </div>
              <div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-soft-info text-info rounded-circle fs-4">
                    <i class="mdi mdi-timer-sand"></i>
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col xxl="3" sm="6">
        <b-card no-body class="card-animate">
          <b-card-body>
            <div class="d-flex justify-content-between">
              <div>
                <p class="fw-medium text-muted mb-0">Closed Tickets</p>
                <h2 class="mt-4 ff-secondary fw-semibold">
                  <count-to :duration="1000" :startVal="0" :endVal="107"></count-to>K
                </h2>
                <p class="mb-0 text-muted">
                  <b-badge class="bg-light text-danger mb-0">
                    <i class="ri-arrow-down-line align-middle"></i> 3.87 %
                  </b-badge>
                  vs. previous month
                </p>
              </div>
              <div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-soft-info text-info rounded-circle fs-4">
                    <i class="ri-shopping-bag-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col xxl="3" sm="6">
        <b-card no-body class="card-animate">
          <b-card-body>
            <div class="d-flex justify-content-between">
              <div>
                <p class="fw-medium text-muted mb-0">Deleted Tickets</p>
                <h2 class="mt-4 ff-secondary fw-semibold">
                  <count-to :duration="1000" :startVal="0" :endVal="15"></count-to>%
                </h2>
                <p class="mb-0 text-muted">
                  <b-badge class="bg-light text-success mb-0">
                    <i class="ri-arrow-up-line align-middle"></i> 1.09 %
                  </b-badge>
                  vs. previous month
                </p>
              </div>
              <div>
                <div class="avatar-sm flex-shrink-0">
                  <span class="avatar-title bg-soft-info text-info rounded-circle fs-4">
                    <i class="ri-delete-bin-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="12">
        <b-card no-body id="ticketsList">
          <b-card-header class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">Tickets</h5>
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <b-button variant="soft-danger" class="me-1" id="remove-actions" @click="deleteMultiple">
                    <i class="ri-delete-bin-2-line"></i>
                  </b-button>
                  <b-button variant="danger" class="add-btn" @click="addnew">
                    <i class="ri-add-line align-bottom me-1"></i> Create Tickets
                  </b-button>
                </div>
              </div>
            </div>
          </b-card-header>
          <b-card-body class="border border-dashed border-end-0 border-start-0">
            <form>
              <b-row class="g-3">
                <b-col xxl="5" sm="12">
                  <div class="search-box">
                    <input type="text" class="form-control search bg-light border-light"
                      placeholder="Search for ticket details or something..." v-model="searchQuery" />
                    <i class="ri-search-line search-icon"></i>
                  </div>
                </b-col>

                <b-col xxl="3" sm="4">
                  <flat-pickr v-model="filterdate1" :config="rangeDateconfig" class="form-control bg-light border-light"
                    placeholder="Select date"></flat-pickr>
                </b-col>

                <b-col xxl="3" sm="4">
                  <div class="input-light">
                    <Multiselect v-model="filtervalue1" :close-on-select="true" :searchable="true" :create-option="true"
                      :options="[
                        { value: '', label: 'Status' },
                        { value: 'All', label: 'All' },
                        { value: 'Open', label: 'Open' },
                        { value: 'Inprogress', label: 'Inprogress' },
                        { value: 'Closed', label: 'Closed' },
                        { value: 'New', label: 'New' },
                      ]" />
                  </div>
                </b-col>
                <b-col xxl="1" sm="4">
                  <b-button type="button" variant="primary" class="w-100" @click="SearchData">
                    <i class="ri-equalizer-fill me-1 align-bottom"></i>
                    Filters
                  </b-button>
                </b-col>
              </b-row>
            </form>
          </b-card-body>
          <b-card-body>
            <div class="table-responsive table-card mb-4">
              <table class="table align-middle table-nowrap mb-0" id="ticketTable">
                <thead>
                  <tr>
                    <th scope="col" style="width: 40px">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="checkAll" value="option" />
                      </div>
                    </th>
                    <th class="sort" data-sort="id">ID</th>
                    <th class="sort" data-sort="tasks_name">Title</th>
                    <th class="sort" data-sort="client_name">Client</th>
                    <th class="sort" data-sort="assignedto">Assigned To</th>
                    <th class="sort" data-sort="create_date">Create Date</th>
                    <th class="sort" data-sort="due_date">Due Date</th>
                    <th class="sort" data-sort="status">Status</th>
                    <th class="sort" data-sort="priority">Priority</th>
                    <th class="sort" data-sort="action">Action</th>
                  </tr>
                </thead>
                <tbody class="list form-check-all">
                  <tr v-for="(data, index) of resultQuery" :key="index">
                    <th scope="row">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="chk_child" value="option1" />
                      </div>
                    </th>
                    <td class="id">
                      <router-link to="/apps/tickets-details" class="fw-medium link-primary">{{ data.id }}</router-link>
                    </td>
                    <td class="tasks_name">
                      {{ data.title }}
                    </td>
                    <td class="client_name">{{ data.client }}</td>
                    <td class="assignedto">{{ data.assigned }}</td>
                    <td class="create_date">{{ data.create }}</td>
                    <td class="due_date">{{ data.due }}</td>
                    <td class="status">
                      <span class="badge text-uppercase" :class="{
                        'badge-soft-warning': data.status == 'Inprogress',
                        'badge-soft-info': data.status == 'New',
                        'badge-soft-success': data.status == 'Open',
                        'badge-soft-danger': data.status == 'Closed',
                      }">{{ data.status }}</span>
                    </td>
                    <td class="priority">
                      <span class="badge text-uppercase" :class="{
                        'bg-danger': data.priority == 'High',
                        'bg-success': data.priority == 'Low',
                        'bg-warning': data.priority == 'Medium',
                      }">{{ data.priority }}</span>
                    </td>
                    <td>
                      <b-dropdown variant="soft-secondary" toggle-class="text-decoration-none arrow-none" size="sm" no-caret>
                        <template #button-content> <i class="ri-more-fill align-middle"></i> </template>
                        <b-dropdown-item href="/apps/tickets-details"><i class="ri-eye-fill align-bottom me-2 text-muted"></i>View</b-dropdown-item>
                        <b-dropdown-item href="#" class="edit-item-btn"  @click="editdata(data)"><i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</b-dropdown-item>
                        <b-dropdown-item href="#" class="remove-item-btn" @click="deletedata(data)"><i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</b-dropdown-item>
                      </b-dropdown>  
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="noresult" style="display: none" :class="{ 'd-block': resultQuery.length == 0 }">
                <div class="text-center">
                  <lottie class="avatar-xl" colors="primary:#121331,secondary:#08a88a" :options="defaultOptions"
                    :height="90" :width="90" />
                  <h5 class="mt-2">Sorry! No Result Found</h5>
                  <p class="text-muted mb-0">
                    We've searched more than 150+ Tickets We did not find any
                    Tickets for you search.
                  </p>
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
                <b-link class="page-item pagination-next" href="#" @click="page++" v-if="page < pages.length">
                  Next
                </b-link>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


    <b-modal v-model="modalShow" id="showModal" modal-class="zoomIn" title-class="exampleModalLabel" hide-footer
      header-class="p-3 bg-soft-info" class="v-modal-custom" centered no-close-on-backdrop size="lg">
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <b-row class="g-3">
          <b-col lg="12">
            <div id="modal-id">
              <label for="orderId" class="form-label">ID</label>
              <input type="text" id="orderId" class="form-control" placeholder="ID" value="#VLZ462" readonly />
            </div>
          </b-col>
          <b-col lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Title</label>
              <input type="text" id="tasksTitle" class="form-control" placeholder="Title" required />
            </div>
          </b-col>
          <b-col lg="6">
            <div>
              <label for="clientName-field" class="form-label">Client</label>
              <input type="text" id="clientName" class="form-control" placeholder="Client Name" required />
            </div>
          </b-col>
          <b-col lg="6">
            <div>
              <label for="assignedtoName-field" class="form-label">Assigned To</label>
              <input type="text" id="assignedtoName" class="form-control" placeholder="Assigned to" required />
            </div>
          </b-col>
          <b-col lg="6">
            <label for="date-field" class="form-label">Create Date</label>

            <flat-pickr v-model="date1" :config="config" class="form-control bg-light border-light" id="cdate">
            </flat-pickr>
          </b-col>
          <b-col lg="6">
            <label for="duedate-field" class="form-label">Due Date</label>

            <flat-pickr v-model="date2" :config="config" class="form-control bg-light border-light" id="ddate">
            </flat-pickr>
          </b-col>
          <b-col lg="6">
            <label for="ticket-status" class="form-label">Status</label>
            <select class="form-control" data-plugin="choices" name="ticket-status" id="ticketstatus">
              <option value="">Status</option>
              <option value="New">New</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Closed">Closed</option>
              <option value="Open">Open</option>
            </select>
          </b-col>
          <b-col lg="6">
            <label for="priority-field" class="form-label">Priority</label>
            <select class="form-control" data-plugin="choices" name="priority-field" id="priority">
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </b-col>
        </b-row>
        <div class="modal-footer v-modal-footer mt-3">
          <div class="hstack gap-2 justify-content-end">
            <b-button type="button" variant="light" @click="modalShow = false" id="closemodal"> Close </b-button>
            <b-button type="submit" variant="success" id="add-btn" @click="addorder"> Add Ticket </b-button>
            <b-button type="button" variant="success" id="edit-btn" @click="updateorder"> Update </b-button>
          </div>
        </div>
      </b-form>
    </b-modal>
  </Layout>
</template>