<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    goTo(link) {
      this.$router.push({name: link})
    }
  }
};
</script>

<template>
  <b-row>
    <b-col cols="12">
      <div class="page-title-box">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item" v-for="(item, index) in items" :key="index" :class="{active: item.active}">
            <b-link @click="goTo(item.to)">{{ item.name }}</b-link>
          </li>
        </ol>
      </div>
    </b-col>
  </b-row>
</template>
