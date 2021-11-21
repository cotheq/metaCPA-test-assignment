<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableItems"
    :loading="loading"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">sdfsdfsdf</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Dessert name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-if="!loading" #no-data> Ничего не найдено </template>
  </v-data-table>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import store from "@/store";
import { EmployeesSearchResult } from "@/api/types";
export default defineComponent({
  name: "EmployeesList",
  setup(props, ctx) {
    const loading = ref(false);
    const dialog = ref(false);
    const dialogDelete = ref(false);
    const tableHeaders = [
      {
        text: "Имя",
        align: "start",
        sortable: false,
        value: "fullName",
      },
      {
        text: "Дата рождения",
        align: "start",
        sortable: false,
        value: "birthDate",
      },
      {
        text: "Должность",
        align: "start",
        sortable: false,
        value: "position",
      },
      {
        text: "Оклад",
        align: "start",
        sortable: false,
        value: "salary",
      },
      {
        text: "Действия",
        value: "actions",
      },
    ];

    const employeesSearchResult = computed<EmployeesSearchResult>(() => {
      console.log(store.getters.getEmployees);
      return store.getters.getEmployees;
    });

    const tableItems = computed(() => {
      return employeesSearchResult.value.result.map((v) => {
        return {
          ...v,
          position: v.position?.name ?? "",
        };
      });
    });

    const editItem = () => {
      dialog.value = true;
    };

    const close = () => {
      dialog.value = false;
    };

    const closeDelete = () => {
      dialogDelete.value = false;
    };

    const deleteItem = () => {
      dialogDelete.value = true;
    };

    const deleteItemConfirm = () => {
      closeDelete();
    };

    const save = () => {
      close();
    };

    loading.value = true;
    store.dispatch("loadEmployees").finally(() => {
      loading.value = false;
    });

    return {
      tableHeaders,
      tableItems,
      employeesSearchResult,
      loading,
      dialog,
      dialogDelete,
      close,
      editItem,
      closeDelete,
      save,
      deleteItem,
      deleteItemConfirm,
    };
  },
});
</script>
<style></style>
