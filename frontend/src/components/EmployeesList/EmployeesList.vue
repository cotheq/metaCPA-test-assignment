<template>
  <div>
    <v-data-table
      :headers="tableHeaders"
      :items="tableItems"
      :loading="loading"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #top>
        <v-toolbar height="auto">
          <v-container>
            <v-row>
              <v-toolbar-title>Список сотрудников</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-dialog v-model="editDialogOpened" width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mb-2" v-bind="attrs" v-on="on">
                    Добавить
                  </v-btn>
                </template>
                <template #default>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{
                        isEditing ? "Редактировать" : "Добавить сотрудника"
                      }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-text-field
                          name="fullName"
                          label="Фио"
                          v-maska="{
                            mask: 'X*',
                            tokens: { X: { pattern: /[a-zA-Zа-яёА-ЯЁ\-\s]/ } },
                          }"
                          :value="employeeToEdit ? employeeToEdit.fullName : ''"
                          @input="(v) => setEditValue('fullName', v)"
                        />

                        <v-text-field
                          name="salary"
                          label="Оклад"
                          v-maska="{ mask: '#######' }"
                          :value="employeeToEdit ? employeeToEdit.salary : ''"
                          @input="(v) => setEditValue('salary', v)"
                        />

                        <v-menu
                          v-model="datePickerOpened"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ on }">
                            <v-text-field
                              :value="employeeToEditBirthDate"
                              append-icon="mdi-calendar"
                              label="Дата рождения"
                              v-maska="{ mask: '####-##-##' }"
                              readonly
                              v-on="on"
                              @click:append="on.click"
                              @input="(v) => setEditValue('birthDate', v)"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            name="birthDate"
                            :value="employeeToEditBirthDate"
                            @input="(v) => setEditValue('birthDate', v)"
                          >
                          </v-date-picker>
                        </v-menu>

                        <span class="text-caption">Должность</span>
                        <v-select
                          :items="employeePositions"
                          item-text="name"
                          item-value="_id"
                          :value="employeeToEditPositionId"
                          @input="(id) => setEditValue('position', id)"
                          solo
                        ></v-select>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="closeEditDialog">Закрыть</v-btn>
                      <v-btn text @click="editItem(employeeToEdit)"
                        >Сохранить</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>

              <v-dialog v-model="deleteDialogOpened" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">
                    Удалить сотрудника
                    {{ employeeToEdit ? employeeToEdit.fullName : "" }}?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteItem(employeeToEdit._id)">
                      Да
                    </v-btn>
                    <v-btn text @click="closeDeleteDialog"> Нет </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row>
              <v-text-field
                name="search"
                placeholder="Найти"
                v-model="searchText"
              />
            </v-row>
          </v-container>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon class="mr-2" @click="openEditDialog(item._id)">
          mdi-pencil
        </v-icon>
        <v-icon @click="openDeleteDialog(item._id)"> mdi-delete </v-icon>
      </template>
      <template v-if="!loading" #no-data> Ничего не найдено </template>
    </v-data-table>

    <v-container>
      <v-row align="center">
        <v-pagination
          v-model="page"
          :length="employeesSearchResult.totalPages"
        ></v-pagination>
        <v-spacer />
        <span class="subtitle-1">На странице:</span>
        <v-btn
          v-for="(v, i) in [1, 5, 10]"
          :key="i"
          small
          text
          @click="setPaginationLimit(v)"
          >{{ v }}</v-btn
        >
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "@vue/composition-api";
import { debounce } from "ts-debounce";
import store from "@/store";
import {
  Employee,
  EmployeePosition,
  EmployeesSearchResult,
  InputEmployeesSearch,
} from "@/types";
export default defineComponent({
  name: "EmployeesList",
  setup() {
    const loading = ref(false);
    const employeesSearchResult = computed<EmployeesSearchResult>(() => {
      return store.getters.getEmployees;
    });
    const employeePositions = computed<EmployeePosition[]>(() => {
      return store.getters.getPositions;
    });
    const tableHeaders = [
      {
        text: "Имя",
        align: "start",
        value: "fullName",
      },
      {
        text: "Дата рождения",
        align: "start",
        value: "birthDate",
      },
      {
        text: "Должность",
        align: "start",
        value: "position",
      },
      {
        text: "Оклад",
        align: "start",
        value: "salary",
      },
      {
        value: "actions",
        sortable: false,
      },
    ];
    const tableItems = computed(() => {
      return employeesSearchResult.value.result.map((v) => {
        return {
          ...v,
          birthDate: String(v.birthDate).slice(0, 10),
          position: v.position?.name ?? "",
        };
      });
    });
    const searchText = ref("");
    const page = ref(1);
    const limit = ref(1);

    const employeeToEdit = ref<Partial<Employee> | null>(null);
    const employeeToEditPositionId = computed<string | null>(() => {
      return employeeToEdit.value?.position?._id || null;
    });
    const employeeToEditBirthDate = computed<string>(() => {
      return String(employeeToEdit?.value?.birthDate || "").slice(0, 10);
    });
    const isEditing = computed<boolean>(() => {
      return !!employeeToEdit?.value?._id || false;
    });

    const datePickerOpened = ref(false);
    const deleteDialogOpened = ref(false);
    const openDeleteDialog = (id: string) => {
      employeeToEdit.value = {
        ...employeesSearchResult.value.result.find((i) => i._id === id),
      };
      deleteDialogOpened.value = true;
    };
    const closeDeleteDialog = () => (deleteDialogOpened.value = false);
    const deleteItem = async (id: string) => {
      await store.dispatch("deleteEmployee", id);
      closeDeleteDialog();
    };

    const editDialogOpened = ref(false);
    const openEditDialog = (id: string) => {
      employeeToEdit.value = {
        ...employeesSearchResult.value.result.find((i) => i._id === id),
      };

      editDialogOpened.value = true;
    };
    const closeEditDialog = () => (editDialogOpened.value = false);
    const editItem = async (newItem: Partial<Employee>) => {
      if (
        !newItem?.fullName ||
        !newItem?.birthDate ||
        !newItem?.salary ||
        !newItem?.position
      ) {
        return;
      }

      const payload = {
        ...newItem,
        birthDate: employeeToEditBirthDate.value,
      };

      if (isEditing.value) {
        await store.dispatch("updateEmployee", payload);
      } else {
        await store.dispatch("addEmployee", payload);
      }
      closeEditDialog();
    };

    const loadEmployees = debounce(async () => {
      loading.value = true;
      await store.dispatch("loadEmployees", {
        limit: limit.value,
        page: page.value,
        fullName: searchText.value,
      });
      loading.value = false;
    }, 300);

    loading.value = true;
    Promise.all([loadEmployees(), store.dispatch("loadPositions")]).finally(
      () => {
        loading.value = false;
      }
    );

    const setEditValue = (key: string, value: any) => {
      let newValue = value;
      if (key === "position") {
        newValue = employeePositions.value.find((v) => v._id === newValue);
      }

      employeeToEdit.value = {
        ...(employeeToEdit.value !== null ? employeeToEdit.value : {}),
        [key]: newValue,
      };
    };

    const setPaginationLimit = (value: number) => {
      limit.value = value;
    };

    watch(searchText, () => {
      loadEmployees();
    });
    watch(page, () => {
      loadEmployees();
    });
    watch(limit, () => {
      page.value = 1;
      loadEmployees();
    });

    watch(editDialogOpened, (newValue) => {
      if (newValue === false) {
        employeeToEdit.value = null;
      }
    });

    watch(deleteDialogOpened, (newValue) => {
      if (newValue === false) {
        employeeToEdit.value = null;
      }
    });

    return {
      loading,
      tableHeaders,
      tableItems,
      employeesSearchResult,
      employeePositions,
      employeeToEdit,
      employeeToEditPositionId,
      employeeToEditBirthDate,
      isEditing,
      setEditValue,
      datePickerOpened,
      deleteDialogOpened,
      openDeleteDialog,
      closeDeleteDialog,
      deleteItem,
      editDialogOpened,
      openEditDialog,
      closeEditDialog,
      editItem,
      searchText,
      page,
      setPaginationLimit,
    };
  },
});
</script>
<style></style>
