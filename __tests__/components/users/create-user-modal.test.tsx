import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { CreateUserModal } from "@/app/users/_components/create-user-modal";
import type { EmployeeCard } from "@/lib/users/users-types";

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, className, type = "text", ...props }: any) => (
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      type={type}
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, className, ...props }: any) => (
    <label data-testid="mock-label" className={className} {...props}>
      {children}
    </label>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant, className, ...props }: any) => (
    <button
      data-testid="mock-button"
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children, disabled, ...props }: any) => (
    <div data-testid="mock-select-wrapper" data-value={value} data-disabled={disabled} {...props}>
      {children}
    </div>
  ),
  SelectContent: ({ children, className, ...props }: any) => (
    <div data-testid="mock-select-content" className={className} role="listbox" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value, className, ...props }: any) => (
    <div 
      data-testid={`mock-select-item-${value}`} 
      data-value={value} 
      className={className} 
      role="option"
      {...props}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className, ...props }: any) => (
    <button data-testid="mock-select-trigger" className={className} type="button" {...props}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder, ...props }: any) => (
    <span data-testid="mock-select-value" {...props}>{placeholder}</span>
  ),
}));

jest.mock("@/components/ui/modal-wrapper", () => ({
  ModalWrapper: ({ open, onClose, title, children }: any) =>
    open ? (
      <div data-testid="mock-modal" data-title={title}>
        <button data-testid="mock-modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

const mockOnClose = jest.fn();
const mockOnCreate = jest.fn();

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onCreate: mockOnCreate,
};

describe("CreateUserModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("modal rendering", () => {
    it("renders modal when open is true", () => {
      render(<CreateUserModal {...defaultProps} />);
      expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
      expect(screen.getByTestId("mock-modal")).toHaveAttribute("data-title", "Create user");
    });

    it("does not render modal when open is false", () => {
      render(<CreateUserModal {...defaultProps} open={false} />);
      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      await user.click(screen.getByTestId("mock-modal-close"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("form fields", () => {
    it("renders all required input fields", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const labels = screen.getAllByTestId("mock-label");
      const labelTexts = labels.map((label: HTMLElement) => label.textContent);
      
      expect(labelTexts).toContain("Email");
      expect(labelTexts).toContain("Password");
      expect(labelTexts).toContain("First Name");
      expect(labelTexts).toContain("Last Name");
      expect(labelTexts).toContain("Department");
      expect(labelTexts).toContain("Position");
      expect(labelTexts).toContain("Role");
    });

    it("renders select fields with default options", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const selectWrappers = screen.getAllByTestId("mock-select-wrapper");
      expect(selectWrappers).toHaveLength(3);
    });

    it("updates form state when typing in email field", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const inputs = screen.getAllByTestId("mock-input");
      const emailInput = inputs[0];
      
      await user.type(emailInput, "test@example.com");
      expect(emailInput).toHaveValue("test@example.com");
    });

    it("updates form state when typing in password field", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const inputs = screen.getAllByTestId("mock-input");
      const passwordInput = inputs[1];
      
      await user.type(passwordInput, "secure123");
      expect(passwordInput).toHaveValue("secure123");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("select interactions", () => {
    it("renders department options", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const selectContents = screen.getAllByTestId("mock-select-content");
      const departmentContent = selectContents[0];
      
      const items = Array.from(departmentContent.querySelectorAll('[data-testid^="mock-select-item-"]'));
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]?.textContent).toBe("React");
    });

    it("renders position options", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const selectContents = screen.getAllByTestId("mock-select-content");
      const positionContent = selectContents[1];
      
      const items = Array.from(positionContent.querySelectorAll('[data-testid^="mock-select-item-"]'));
      expect(items[0]?.textContent).toBe("Software Engineer");
    });

    it("renders role options", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const selectContents = screen.getAllByTestId("mock-select-content");
      const roleContent = selectContents[2];
      
      const items = Array.from(roleContent.querySelectorAll('[data-testid^="mock-select-item-"]'));
      const itemTexts = items.map((item: Element) => item.textContent);
      
      expect(itemTexts).toContain("Employee");
      expect(itemTexts).toContain("Admin");
    });
  });

  describe("create button", () => {
    it("is disabled when required fields are empty", () => {
      render(<CreateUserModal {...defaultProps} />);
      
      const buttons = screen.getAllByTestId("mock-button");
      const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === "Create");
      
      expect(createButton).toBeDisabled();
    });

    it("becomes enabled when all required fields are filled", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const inputs = screen.getAllByTestId("mock-input");
      await user.type(inputs[0], "test@example.com");
      await user.type(inputs[1], "pass123");
      await user.type(inputs[2], "John");
      await user.type(inputs[3], "Doe");
      
      const buttons = screen.getAllByTestId("mock-button");
      const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === "Create");
      
      expect(createButton).not.toBeDisabled();
    });

    it("calls onCreate with correct user data when clicked", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const inputs = screen.getAllByTestId("mock-input");
      await user.type(inputs[0], "john@example.com");
      await user.type(inputs[1], "secure123");
      await user.type(inputs[2], "John");
      await user.type(inputs[3], "Doe");
      
      const buttons = screen.getAllByTestId("mock-button");
      const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === "Create");
      
      await user.click(createButton!);
      
      expect(mockOnCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          department: "React",
          position: "Software Engineer",
          initials: "JD",
          isVerified: false,
          avatar: null,
          id: expect.any(Number),
        })
      );
    });

    it("resets form after successful creation", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const inputs = screen.getAllByTestId("mock-input");
      await user.type(inputs[0], "test@test.com");
      await user.type(inputs[1], "pass");
      await user.type(inputs[2], "Test");
      await user.type(inputs[3], "User");
      
      const buttons = screen.getAllByTestId("mock-button");
      const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === "Create");
      await user.click(createButton!);
      
      expect(inputs[0]).toHaveValue("");
      expect(inputs[2]).toHaveValue("");
    });
  });

  describe("cancel button", () => {
    it("calls onClose when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<CreateUserModal {...defaultProps} />);
      
      const buttons = screen.getAllByTestId("mock-button");
      const cancelButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === "Cancel");
      
      await user.click(cancelButton!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
