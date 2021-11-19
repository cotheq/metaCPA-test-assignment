<template>
  <div>
    <div v-for="e in employeesList" :key="e._id">{{ e }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  name: "EmployeesList",
  setup() {
    const getEmployeesList = async () => {
      const res = await fetch("/api/employees");
      console.log("here");
      console.log(res);
      return await res.json();
    };
    const employeesList = ref<any>([]);
    getEmployeesList().then((value) => (employeesList.value = value));
    return { employeesList };
  },
});
</script>
<style></style>
