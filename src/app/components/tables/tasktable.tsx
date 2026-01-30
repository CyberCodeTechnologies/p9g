"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TaskEditForm from "../forms/taskeditform"
import TaskNotesDialog from "../dialogs/tasknotesdialog"
import { useState } from "react"
import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom"
import { formatDateTime } from "@/core/helpers"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default function TaskTable({ data, userMap, departmentMap }: { data: any[], userMap: Map<string, string>, departmentMap: Map<string, string> }) {
    const [notesTaskId, setNotesTaskId] = useState<string | null>(null);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => {
                const deptId = row.getValue("department") as string;
                return departmentMap.get(deptId) || deptId;
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const dueDate = row.original.dueDate ? new Date(row.original.dueDate) : null;
                const isOverdue = dueDate && dueDate < new Date() && status === 'Open';

                let colorClass = "font-bold";
                if (status === "Closed") {
                    colorClass = "text-gray-600 font-bold";
                } else if (isOverdue) {
                    colorClass = "text-red-600 font-bold";
                } else if (status === "Open") {
                    colorClass = "text-blue-600 font-bold";
                }

                return <span className={colorClass}>{isOverdue ? "Over Due" : status}</span>
            }
        },
        {
            accessorKey: "assignToUserId",
            header: "Assigned To",
            cell: ({ row }) => {
                const userId = row.getValue("assignToUserId") as string;
                return userMap.get(userId) || "";
            }
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                return formatDateTime(row.getValue("dueDate"));
            }
        },
        {
            accessorKey: "completedDate",
            header: "Completed Date",
             cell: ({ row }) => {
                return formatDateTime(row.getValue("completedDate"));
            }
        },
        {
            accessorKey: "createdAtUTC",
            header: "Created At",
            cell: ({ row }) => {
                 return formatDateTime(row.getValue("createdAtUTC"));
            }
        },
        {
            accessorKey: "updatedAtUTC",
            header: "Updated At",
            cell: ({ row }) => {
                 return formatDateTime(row.getValue("updatedAtUTC"));
            }
        },
        {
            accessorKey: "createdBy",
            header: "Created By",
            cell: ({ row }) => {
                const userId = row.getValue("createdBy") as string;
                return userMap.get(userId) || "";
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const task = row.original;
                return (
                    <div className="flex gap-2">
                        <TaskEditForm task={task} userMap={userMap} departmentMap={departmentMap} />
                        <ButtonCustom variant="outline" size="sm" onClick={() => setNotesTaskId(task.id)}>Notes</ButtonCustom>
                    </div>
                )
            }
        }
    ]

    return (
        <div>
            <DataTable columns={columns} data={data} />
            <TaskNotesDialog isOpen={!!notesTaskId} taskId={notesTaskId!} onOpenChanged={(open) => !open && setNotesTaskId(null)} userMap={userMap} />
        </div>
    )
}
