<template>
  <div class="card py-2 px-3 manage__header--bar row" style="background-color: #d7d8d9">
      <slot name="add_button"></slot>
      <!--        <div class="editor-bar">
                  <ul class="main-editor">
                      <li>
                          <i class="mdi mdi-content-cut"></i>
                      </li>
                      <li>
                          <i class="mdi mdi-content-copy"></i>
                      </li>
                      <li>
                          <i class="mdi mdi-content-paste"></i>
                      </li>
                      <li>
                          <i class="mdi mdi-content-duplicate"></i>
                      </li>
                      <li>
                          <i class="mdi mdi-delete-outline"></i>
                      </li>
                  </ul>
                  <ul class="sort-view">
                      <li>
                          <i class="bx bx-sort-alt-2"></i>
                          <span>Sort</span>
                          <i class="mdi mdi-chevron-down"></i>
                      </li>
                      <li>
                          <i class="mdi mdi-content-duplicate"></i>
                      </li>
                      <li @click="store.viewMode = !store.viewMode">
                          <i class="mdi mdi-order-bool-descending"></i>
                          <span>View</span>
                          <i class="mdi mdi-chevron-down"></i>
                      </li>
                  </ul>

                  <span class="see-more mx-3">
                      <i class="mdi mdi-dots-horizontal"></i>
                  </span>
              </div>-->
      <slot name="input_search"></slot>

  </div>
</template>

<script setup>
import {useFolderStore} from '../state/folder';

const store = useFolderStore();
</script>