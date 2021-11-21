<template>
  <v-app>
    <v-main>
      <EmployeesList />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import EmployeesList from "@/components/EmployeesList/EmployeesList.vue";

export default Vue.extend({
  name: "App",

  components: {
    EmployeesList,
  },
});
</script>
