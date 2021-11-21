interface EmployeePosition {
  _id: string;
  name: string;
}

interface Employee {
  _id: string;
  fullName: string;
  birthDate: Date;
  position: EmployeePosition | null;
  salary: number;
}

export interface EmployeesSearchResult {
  totalPages: number;
  totalRecords: number;
  page: number;
  skip: number;
  limit: number;
  result: Employee[];
}

export interface InputEmployeesSearch {
  fullName?: string;
  limit?: number;
  page?: number;
}
