import axios from "axios";
import {
  Employee,
  EmployeePosition,
  EmployeesSearchResult,
  InputEmployeesSearch,
} from "@/types";

const instance = axios.create({
  baseURL: "/api/",
});

const loadEmployees: (
  params: InputEmployeesSearch
) => Promise<EmployeesSearchResult | null> = async (
  params: InputEmployeesSearch
) => {
  let result: EmployeesSearchResult | null = null;
  try {
    const response = await instance.get<EmployeesSearchResult>("/employees", {
      params,
    });
    result = response.data;
  } catch (e) {
    console.error(e);
  }
  return result;
};

const loadPositions: () => Promise<EmployeePosition[] | null> = async () => {
  let result: EmployeePosition[] | null = null;
  try {
    const response = await instance.get<EmployeePosition[]>("/positions");
    result = response.data;
  } catch (e) {
    console.error(e);
  }
  return result;
};

const updateEmployee: (params: Employee) => Promise<Employee | null> = async (
  params
) => {
  let result: Employee | null = null;
  try {
    const response = await instance.put<Employee>("/employees", null, {
      params: { ...params, position: params.position?._id },
    });
    result = response.data;
  } catch (e) {
    console.error(e);
  }
  return result;
};

const addEmployee: (params: Omit<Employee, "_id">) => Promise<Employee | null> =
  async (params) => {
    let result: Employee | null = null;
    try {
      const response = await instance.post<Employee>("/employees", null, {
        params: { ...params, position: params.position?._id },
      });
      result = response.data;
    } catch (e) {
      console.error(e);
    }
    return result;
  };

const deleteEmployee: (id: string) => Promise<Employee | null> = async (id) => {
  let result: Employee | null = null;
  try {
    const response = await instance.delete<Employee>("/employees", {
      params: { _id: id },
    });
    result = response.data;
  } catch (e) {
    console.error(e);
  }
  return result;
};

export default {
  loadEmployees,
  loadPositions,
  updateEmployee,
  addEmployee,
  deleteEmployee,
};
