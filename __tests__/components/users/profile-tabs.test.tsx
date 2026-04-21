import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { ProfileTabs } from "@/app/(protected)/users/[id]/_components/profile-tabs";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/users/1"),
  Link: ({ href, children, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

const mockTabs = [
  { id: "profile", label: "PROFILE", href: "/users/1" },
  { id: "skills", label: "SKILLS", href: "/users/1/skills" },
  { id: "languages", label: "LANGUAGES", href: "/users/1/languages" },
];

const locales = ["en", "de", "ru"] as const;

describe("ProfileTabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(locales)("locale: %s", (locale) => {
    describe("rendering", () => {
      it("renders all tabs with correct labels", () => {
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        expect(screen.getByText("PROFILE")).toBeInTheDocument();
        expect(screen.getByText("SKILLS")).toBeInTheDocument();
        expect(screen.getByText("LANGUAGES")).toBeInTheDocument();
      });

      it("renders tabs as links with correct hrefs", () => {
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(3);
        expect(links[0]).toHaveAttribute("href", "/users/1");
        expect(links[1]).toHaveAttribute("href", "/users/1/skills");
        expect(links[2]).toHaveAttribute("href", "/users/1/languages");
      });
    });

    describe("active tab styling", () => {
      const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

      it("applies active styles to profile tab when on profile page", () => {
        mockedUsePathname.mockReturnValue("/users/1");
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        const profileLink = screen.getByText("PROFILE").closest("a");
        expect(profileLink).toHaveClass("text-red-500");
      });

      it("applies active styles to skills tab when on skills page", () => {
        mockedUsePathname.mockReturnValue("/users/1/skills");
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        const skillsLink = screen.getByText("SKILLS").closest("a");
        expect(skillsLink).toHaveClass("text-red-500");
      });

      it("applies active styles to languages tab when on languages page", () => {
        mockedUsePathname.mockReturnValue("/users/1/languages");
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        const languagesLink = screen.getByText("LANGUAGES").closest("a");
        expect(languagesLink).toHaveClass("text-red-500");
      });

      it("shows active indicator bar for active tab", () => {
        mockedUsePathname.mockReturnValue("/users/1/skills");
        render(<ProfileTabs tabs={mockTabs} userId="1" />);

        const skillsTab = screen.getByText("SKILLS").closest("a");
        expect(skillsTab?.querySelector(".bg-red-500")).toBeInTheDocument();
      });
    });
  });
});
