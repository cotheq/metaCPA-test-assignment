import Vue from "vue";
import Vuex from "vuex";
import api from "@/api";
import {
  Employee,
  EmployeesSearchResult,
  InputEmployeesSearch,
} from "@/api/types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    employees: {
      totalRecords: 0,
      totalPages: 0,
      page: 0,
      limit: 0,
      skip: 0,
      result: [],
    } as EmployeesSearchResult,
  },
  getters: {
    getEmployees(state) {
      return state.employees;
    },
  },
  mutations: {
    SET_EMPLOYEES(state, payload: EmployeesSearchResult) {
      state.employees = payload;
    },
  },
  actions: {
    async loadEmployees({ commit }, params: InputEmployeesSearch) {
      const result = await api.loadEmployees(params);
      if (result) {
        commit("SET_EMPLOYEES", result);
      }
    },
  },
  modules: {},
});
