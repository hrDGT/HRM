export type EmployeeCard = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar: string | null;
  initials: string;
  isVerified?: boolean;
};

export type EmployeeProfile = EmployeeCard & {
  memberSince?: string;
  role: string;
  cvs?: Array<{ id: number; title: string; uploadedAt?: string }>;
};
