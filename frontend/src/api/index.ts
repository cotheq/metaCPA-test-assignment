import axios from "axios";
import { EmployeesSearchResult, InputEmployeesSearch } from "@/api/types";

const instance = axios.create({
  baseURL: "/api/",
});

export const loadEmployees: (
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

export default {
  loadEmployees,
};
