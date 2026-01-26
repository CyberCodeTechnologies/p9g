"use client"

import * as React from "react";
import {
  ColumnDef
} from "@tanstack/react-table";
import DataTable from "../../../lib/components/web/react/uicustom/datatable";
import { FormState } from "@/core/types";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import Task from "@/core/models/domain/Task"
import TaskEditForm from "../forms/taskeditform";
import { CopyIcon } from "lucide-react";
import TaskNotesDialog from "../dialogs/tasknotesdialog";


interface DataTableProps {
  formState: FormState;
  formAction: (formData: FormData) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  userMap: Map<string, string>;
  departmentMap: Map<string, string>;
}

export default function TaskTable({
  formState,
  formAction,
  formRef,
  userMap,
  departmentMap
}: DataTableProps) {

  const openCallbackFunc = React.useRef<{ openDialog: (open: boolean) => void, setEditTask: (task: Task) => void } | undefined>(undefined);
  const [notesOpen, setNotesOpen] = React.useState(false);
  const [notesTaskId, setNotesTaskId] = React.useState<string | null>(null);

  const [clientState, setClientState] = React.useState(formState);

  React.useEffect(() => {
    setClientState(formState);
  }, [formState]);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => {
        return <div>
          {String(row.getValue("id")).substring(0, 8)} <CopyIcon className="inline w-[20px] cursor-pointer" onClick={e => navigator.clipboard.writeText(row.getValue("id"))} />
        </div>
      }
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return <div>
          {row.getValue('title')}
        </div>
      }
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div>
          {row.getValue('description')}
        </div>
      }
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        return <div>
          {row.getValue('department')}
        </div>
      }
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
          return <div>
            {row.getValue('notes')}
          </div>
        }
      },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const dueDate = row.original.dueDate;
        const isOverdue = status !== 'Closed' && dueDate && new Date(dueDate) < new Date();
        
        let className = "font-bold ";
        if (isOverdue) className += "text-red-600";
        else if (status === 'Open') className += "text-green-600";
        else if (status === 'Done') className += "text-blue-600";
        else if (status === 'Closed') className += "text-black";

        return <div className={className}>
          {status} {isOverdue ? "(Overdue)" : ""}
        </div>
      }
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = row.getValue('dueDate');
        return <div>
          {date ? new Date(date as string).toLocaleDateString() : ''}
        </div>
      }
    },
    {
      accessorKey: "assignToUserId",
      header: "Assigned To",
      cell: ({ row }) => {
        const userId = row.getValue('assignToUserId') as string;
        return <div>
          {userMap.get(userId) ?? userId}
        </div>
      }
    },
    {
        accessorKey: "createdAtUTC",
        header: "Created At",
        cell: ({ row }) => {
          return <div>
            {row.getValue('createdAtUTC') ? new Date(row.getValue('createdAtUTC')).toLocaleString() : ''}
          </div>
        }
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
            const userId = row.getValue('createdBy') as string;
            return <div>
            {userMap.get(userId) ?? userId}
            </div>
        }
    },
    {
        accessorKey: "updatedAtUTC",
        header: "Updated At",
        cell: ({ row }) => {
            return <div>
            {row.getValue('updatedAtUTC') ? new Date(row.getValue('updatedAtUTC')).toLocaleString() : ''}
            </div>
        }
    },
    {
        accessorKey: "updatedBy",
        header: "Updated By",
        cell: ({ row }) => {
            const userId = row.getValue('updatedBy') as string;
            return <div>
            {userMap.get(userId) ?? userId}
            </div>
        }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex gap-2">
            <ButtonCustom variant="default" size="sm" type="button" onClick={() => {
              openCallbackFunc.current?.setEditTask(task);
              openCallbackFunc.current?.openDialog(true);
            }}>Edit</ButtonCustom>
            <ButtonCustom variant="outline" size="sm" type="button" onClick={() => {
              setNotesTaskId(task.id);
              setNotesOpen(true);
            }}>Notes</ButtonCustom>
          </div>
        )
      }
    }
  ]

  const handleSave = (task: Task) => {
    formRef.current?.requestSubmit();
  };

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} formState={clientState} formAction={formAction} formRef={formRef} />
      <TaskEditForm onSaved={handleSave} openCallback={(func) => openCallbackFunc.current = func} userMap={userMap} departmentMap={departmentMap} />
      {notesTaskId && <TaskNotesDialog isOpen={notesOpen} taskId={notesTaskId} onOpenChanged={setNotesOpen} userMap={userMap} />}
    </div>
  );
}
