import Vue from "vue";
import Vuex from "vuex";
import api from "@/api";
import {
  Employee,
  EmployeePosition,
  EmployeesSearchResult,
  InputEmployeesSearch,
} from "@/types";

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
    positions: [] as EmployeePosition[],
    employesAddedOrDeleted: false,
  },
  getters: {
    getEmployees(state) {
      return state.employees;
    },
    getPositions(state) {
      return state.positions;
    },
  },
  mutations: {
    SET_EMPLOYEES(state, payload: EmployeesSearchResult) {
      state.employees = payload;
      state.employesAddedOrDeleted = false;
    },
    UPDATE_EMPLOYEE(state, payload: Employee) {
      const index = state.employees.result.findIndex(
        (v) => v._id === payload._id
      );
      if (index >= 0) {
        state.employees.result.splice(index, 1, {
          ...payload,
        });
      }
    },
    DELETE_EMPLOYEE(state, payload: string) {
      const index = state.employees.result.findIndex((v) => v._id === payload);
      if (index >= 0) {
        state.employees.result.splice(index, 1);
      }
      state.employesAddedOrDeleted = true;
    },
    ADD_EMPLOYEE(state, payload: Employee) {
      state.employees.result.push(payload);
      state.employesAddedOrDeleted = true;
    },
    SET_POSITIONS(state, payload: EmployeePosition[]) {
      state.positions = payload;
    },
  },
  actions: {
    async loadEmployees({ commit }, params: InputEmployeesSearch) {
      const result = await api.loadEmployees(params);
      if (result) {
        commit("SET_EMPLOYEES", result);
      }
    },
    async loadPositions({ commit }) {
      const result = await api.loadPositions();
      console.log(result);
      if (result) {
        commit("SET_POSITIONS", result);
      }
    },
    async updateEmployee({ commit }, params: Employee) {
      const result = await api.updateEmployee(params);
      if (result) {
        commit("UPDATE_EMPLOYEE", result);
      }
    },
    async addEmployee({ commit }, params: Omit<Employee, "id">) {
      const result = await api.addEmployee(params);
      if (result) {
        commit("ADD_EMPLOYEE", result);
      }
    },
    async deleteEmployee({ commit }, id: string) {
      const result = await api.deleteEmployee(id);
      if (result) {
        commit("DELETE_EMPLOYEE", id);
      }
    },
  },
  modules: {},
});
