import { render, screen, fireEvent, within } from "@testing-library/react";
import { EmployeesClient } from "../../app/users/_components/employees-client";
import { Employee } from "../../app/users/page";
 
const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", department: "React", position: "Software Engineer", avatar: null, initials: "AS" },
  { id: 2, firstName: "Bob", lastName: "Jones", email: "bob@example.com", department: "Java", position: "Data Analyst", avatar: null, initials: "BJ" },
  { id: 3, firstName: "Carol", lastName: "White", email: "carol@example.com", department: "Blockchain", position: "DevOps Engineer", avatar: null, initials: "CW" },
  { id: 4, firstName: "", lastName: "", email: "anon@example.com", department: "DevOps", position: "", avatar: null, initials: "A" },
];
 
describe("EmployeesClient", () => {
  describe("rendering", () => {
    it("renders all employees initially", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Carol")).toBeInTheDocument();
    });
 
    it("renders the search input", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
 
    it("renders the Department column header", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      expect(screen.getByText("Department")).toBeInTheDocument();
    });
 
    it("renders all nav items", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      const nav = screen.getByRole("navigation");
      expect(within(nav).getByText("Employees")).toBeInTheDocument();
      expect(within(nav).getByText("Skills")).toBeInTheDocument();
      expect(within(nav).getByText("Languages")).toBeInTheDocument();
      expect(within(nav).getByText("CVs")).toBeInTheDocument();
    });
 
    it("renders em-dash for empty firstName", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThan(0);
    });
 
    it("renders department badges", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Java")).toBeInTheDocument();
      expect(screen.getByText("Blockchain")).toBeInTheDocument();
    });
  });
 
  describe("search", () => {
    it("filters by first name", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "Alice" } });
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.queryByText("Carol")).not.toBeInTheDocument();
    });
 
    it("filters by last name", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "Jones" } });
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
 
    it("filters by email", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "carol@example.com" } });
      expect(screen.getByText("Carol")).toBeInTheDocument();
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
 
    it("filters by department", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "blockchain" } });
      expect(screen.getByText("Carol")).toBeInTheDocument();
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
 
    it("filters by position", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "DevOps Engineer" } });
      expect(screen.getByText("Carol")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
 
    it("is case-insensitive", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "ALICE" } });
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
 
    it("shows empty state when no results match", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "zzznomatch" } });
      expect(screen.getByText("No employees found")).toBeInTheDocument();
    });
 
    it("restores all rows when search is cleared", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      const input = screen.getByPlaceholderText("Search");
      fireEvent.change(input, { target: { value: "Alice" } });
      fireEvent.change(input, { target: { value: "" } });
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
 
  describe("sorting", () => {
    it("sorts departments ascending by default", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      const cells = screen.getAllByText(/.+/).filter((el) =>
        ["React", "Java", "Blockchain", "DevOps"].includes(el.textContent ?? "")
      );
      const texts = cells.map((el) => el.textContent);
      const sorted = [...texts].sort((a, b) => (a ?? "").localeCompare(b ?? ""));
      expect(texts).toEqual(sorted);
    });
 
    it("toggles to descending on Department header click", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      fireEvent.click(screen.getByText("Department"));
      const cells = screen.getAllByText(/.+/).filter((el) =>
        ["React", "Java", "Blockchain", "DevOps"].includes(el.textContent ?? "")
      );
      const texts = cells.map((el) => el.textContent);
      const sortedDesc = [...texts].sort((a, b) => (b ?? "").localeCompare(a ?? ""));
      expect(texts).toEqual(sortedDesc);
    });
 
    it("toggles back to ascending on second Department header click", () => {
      render(<EmployeesClient employees={MOCK_EMPLOYEES} />);
      const header = screen.getByText("Department");
      fireEvent.click(header);
      fireEvent.click(header);
      const cells = screen.getAllByText(/.+/).filter((el) =>
        ["React", "Java", "Blockchain", "DevOps"].includes(el.textContent ?? "")
      );
      const texts = cells.map((el) => el.textContent);
      const sorted = [...texts].sort((a, b) => (a ?? "").localeCompare(b ?? ""));
      expect(texts).toEqual(sorted);
    });
  });
 
  describe("empty employees list", () => {
    it("shows empty state immediately", () => {
      render(<EmployeesClient employees={[]} />);
      expect(screen.getByText("No employees found")).toBeInTheDocument();
    });
  });
});
