import { EmployeesClient } from "./_components/employees-client";

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar: string | null;
  initials: string;
}

async function getEmployees(): Promise<Employee[]> {
  return [
    { id: 1, firstName: "Rostislav", lastName: "Harlanov", email: "thorn_pear@icloud.com", department: "React", position: "Software Engineer", avatar: null, initials: "RH" },
    { id: 2, firstName: "Vanf", lastName: "Darkholme", email: "tomgar9@outlook.com", department: ".NET", position: "Network Engineer", avatar: null, initials: "VD" },
    { id: 3, firstName: "Christoper", lastName: "Nolan", email: "christophernolan@gmail.com", department: "Blockchain", position: "DevOps Engineer", avatar: null, initials: "CN" },
    { id: 4, firstName: "", lastName: "", email: "vovavipse@gmail.com", department: "Blockchain", position: "", avatar: null, initials: "V" },
    { id: 5, firstName: "Марина", lastName: "", email: "persempre1+1@yandex.ru", department: "DevOps", position: "Data Analyst", avatar: null, initials: "М" },
    { id: 6, firstName: "Maksimodvj", lastName: "Hancharouiy", email: "maxim.goncharov@gmail.com", department: "Global", position: "Data Analyst", avatar: null, initials: "MH" },
    { id: 7, firstName: "Artem", lastName: "Lopatin", email: "artsem.lapatsin@innowise.com", department: "Global", position: "Project Manager", avatar: null, initials: "AL" },
    { id: 8, firstName: "sdsdsdsdsdsdsdvdf", lastName: "", email: "ferdik@mail.ru", department: "Java", position: "Data Analyst", avatar: null, initials: "SD" },
    { id: 9, firstName: "Artem", lastName: "Zhiznevskiy", email: "zhiznevskiy@gmail.com", department: "Java", position: "Data Analyst", avatar: null, initials: "AZ" },
    { id: 10, firstName: "Eva", lastName: "", email: "test123456789@gmail.com", department: "Mobile", position: "Software Engineer", avatar: null, initials: "E" },
  ];
}

export default async function UsersPage() {
  const employees = await getEmployees();
  return <EmployeesClient employees={employees} />;
}