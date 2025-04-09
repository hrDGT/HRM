import { cookies } from "next/headers";
import { UserProfileClient } from "./_components/user-profile-client";

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar: string | null;
  initials: string;
  memberSince?: string;
};

async function getEmployee(id: number): Promise<Employee | null> {
  const employees: Employee[] = [
    { id: 1, firstName: "Rostislav", lastName: "Harlanov", email: "thorn_pear@icloud.com", department: "React", position: "Software Engineer", avatar: null, initials: "RH", memberSince: "Sun Jan 14 2024" },
    { id: 2, firstName: "Vanf", lastName: "Darkholme", email: "tomgar9@outlook.com", department: ".NET", position: "Network Engineer", avatar: null, initials: "VD", memberSince: "Mon Feb 05 2024" },
    { id: 3, firstName: "Christoper", lastName: "Nolan", email: "christophernolan@gmail.com", department: "Blockchain", position: "DevOps Engineer", avatar: null, initials: "CN", memberSince: "Wed Mar 20 2024" },
    { id: 4, firstName: "", lastName: "", email: "vovavipse@gmail.com", department: "Blockchain", position: "", avatar: null, initials: "V", memberSince: "Thu Apr 11 2024" },
    { id: 5, firstName: "Марина", lastName: "", email: "persempre1+1@yandex.ru", department: "DevOps", position: "Data Analyst", avatar: null, initials: "М", memberSince: "Fri May 03 2024" },
    { id: 6, firstName: "Maksimodvj", lastName: "Hancharouiy", email: "maxim.goncharov@gmail.com", department: "Global", position: "Data Analyst", avatar: null, initials: "MH", memberSince: "Sat Jun 15 2024" },
    { id: 7, firstName: "Artem", lastName: "Lopatin", email: "artsem.lapatsin@innowise.com", department: "Global", position: "Project Manager", avatar: null, initials: "AL", memberSince: "Sun Jul 07 2024" },
    { id: 8, firstName: "sdsdsdsdsdsdsdvdf", lastName: "", email: "ferdik@mail.ru", department: "Java", position: "Data Analyst", avatar: null, initials: "SD", memberSince: "Mon Aug 19 2024" },
    { id: 9, firstName: "Artem", lastName: "Zhiznevskiy", email: "zhiznevskiy@gmail.com", department: "Java", position: "Data Analyst", avatar: null, initials: "AZ", memberSince: "Tue Sep 10 2024" },
    { id: 10, firstName: "Eva", lastName: "", email: "test123456789@gmail.com", department: "Mobile", position: "Software Engineer", avatar: null, initials: "E", memberSince: "Wed Oct 02 2024" },
  ];

  return employees.find((e) => e.id === id) || null;
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployee(Number(id));

  const cookieStore = await cookies();
  const currentUserId = Number(cookieStore.get("userId")?.value);

  if (!employee) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#353535] text-zinc-400">
        <p className="text-sm">Employee not found</p>
      </div>
    );
  }

  return <UserProfileClient employee={employee} currentUserId={currentUserId} />;
}
