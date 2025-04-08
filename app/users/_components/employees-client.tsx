"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  Users,
  Lightbulb,
  Languages,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Employee } from "../page";

const NAV_ITEMS = [
  { label: "Employees", icon: Users, href: "/users", active: true },
  { label: "Skills", icon: Lightbulb, href: "/skills", active: false },
  { label: "Languages", icon: Languages, href: "/languages", active: false },
  { label: "CVs", icon: FileText, href: "/cvs", active: false },
];

type Props = {
  employees: Employee[];
}

export function EmployeesClient({ employees }: Props) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = employees
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = a.department.toLowerCase();
      const db = b.department.toLowerCase();
      return sortAsc ? da.localeCompare(db) : db.localeCompare(da);
    });

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-zinc-200 overflow-hidden">
      <aside className="w-56 flex-shrink-0 bg-[#141414] border-r border-white/5 flex flex-col">
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
            <a
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              <Icon size={16} className={active ? "text-white" : "text-zinc-500"} />
              {label}
            </a>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
                R
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-zinc-300 truncate">Rostislav Harlanov</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-white/5">
          <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest font-semibold">
            Employees
          </p>
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-8 h-9 bg-white/5 border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-10" />
                <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  First Name
                </TableHead>
                <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Last Name
                </TableHead>
                <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead
                  className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => setSortAsc((v) => !v)}
                >
                  <span className="flex items-center gap-1">
                    Department
                    {sortAsc ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ArrowUpDown size={12} className="text-zinc-600" />
                    )}
                  </span>
                </TableHead>
                <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  Position
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="border-white/5 hover:bg-white/[0.03] cursor-pointer group transition-colors"
                >
                  <TableCell className="py-3">
                    <Avatar className="h-8 w-8">
                      {emp.avatar && <AvatarImage src={emp.avatar} />}
                      <AvatarFallback className="text-xs font-semibold bg-zinc-700 text-zinc-300">
                        {emp.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="text-sm text-zinc-200 py-3 font-medium">
                    {emp.firstName || "—"}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-200 py-3">
                    {emp.lastName || "—"}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-400 py-3">
                    {emp.email}
                  </TableCell>

                  <TableCell className="py-3">
                    {emp.department ? (
                      <Badge
                        variant="outline"
                        className="text-xs font-medium px-2 py-0.5 rounded-md border bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      >
                        {emp.department}
                      </Badge>
                    ) : (
                      <span className="text-zinc-600 text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-300 py-3">
                    {emp.position || "—"}
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-md hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1e1e1e] border-white/10 text-zinc-200 text-sm min-w-[140px]"
                        >
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <button className="p-1.5 rounded-md hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <Users size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No employees found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
