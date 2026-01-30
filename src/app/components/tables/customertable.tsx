"use client"

import * as React from "react";
import {
  ColumnDef
} from "@tanstack/react-table";
import DataTable from "../../../lib/components/web/react/uicustom/datatable";
import { FormState } from "@/core/types";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import Customer from "@/core/models/domain/Customer"
import CustomerEditForm from "../forms/customereditform";
import { CopyIcon } from "lucide-react";
import { customerBulkDelete } from "@/app/(private)/console/customers/actions";
import { toast } from "sonner";
import Link from "next/link";


interface DataTableProps {
  formState: FormState;
  formAction: (formData: FormData) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function CustomerTable({
  formState,
  formAction,
  formRef,
}: DataTableProps) {

  const openCallbackFunc = React.useRef<{ openDialog: (open: boolean) => void, setEditCustomer: (customer: Customer) => void } | undefined>(undefined);

  const [clientState, setClientState] = React.useState(formState);
  const nameRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const dobRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const nationalIdRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const passportRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const phoneRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const emailRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const addressRefs = React.useRef<Record<string, HTMLInputElement>>({});
  const countryRefs = React.useRef<Record<string, HTMLInputElement>>({});

  const [selectedRowIds, setSelectedRowIds] = React.useState({});

  const handleBulkDelete = async () => {
    const count = Object.keys(selectedRowIds).length;
    if (count === 0) return;
    
    if(!confirm(`Are you sure you want to delete ${count} customers?`)) return;

    const selectedIndices = Object.keys(selectedRowIds).map(Number);
    if (!formState.data) return;
    
    const idsToDelete = selectedIndices.map(index => formState.data[index]?.id).filter(Boolean);
    
    if (idsToDelete.length === 0) return;

    await customerBulkDelete(idsToDelete);
    setSelectedRowIds({});
    toast.success("Customers deleted");
  };

  React.useEffect(() => {
    setClientState(formState);
  }, [formState]);

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="translate-y-[2px] w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          className="translate-y-[2px] w-4 h-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <div>
          <Link href={`/console/customers/${row.original.id}`} className="text-blue-600 hover:underline">
            {row.getValue('name')}
          </Link>
        </div>
      }
    },
    {
      accessorKey: "englishName",
      header: "English Name",
      cell: ({ row }) => {
        return <div>
          {row.getValue('englishName')}
        </div>
      }
    },
    {
      accessorKey: "gender",
      header: "Gender"
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ row }) => {
        return <div>
          {row.getValue('dob') ? new Date(row.getValue('dob')).toLocaleDateString('sv-SE') : ''}
        </div>
      }
    },
    {
      accessorKey: "nationalId",
      header: "National ID",
      cell: ({ row }) => {
        return <div>
          {row.getValue('nationalId')}
        </div>
      }
    },
    {
      accessorKey: "passport",
      header: "Passport",
      cell: ({ row }) => {
        return <div>
          {row.getValue('passport')}
        </div>
      }
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return <div>
          {row.getValue('phone')}
        </div>
      }
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div>
          {row.getValue('email')}
        </div>
      }
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        return <div>
          {row.getValue('address')}
        </div>
      }
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => {
        return <div>
          {row.getValue('country')}
        </div>
      }
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return <div>
          <ButtonCustom variant={"black"} size={"sm"} type="button" onClick={(e) => {
            openCallbackFunc.current?.setEditCustomer(row.original);
            openCallbackFunc.current?.openDialog(true);
          }}>Edit</ButtonCustom>
        </div>
      }
    },
  ];

  const handleSave = (customer: Customer) => {
    window.location.reload();
  };


  return (
    <div>
      {Object.keys(selectedRowIds).length > 0 && (
        <div className="mb-2 flex justify-end">
          <ButtonCustom variant="red" onClick={handleBulkDelete}>Delete Selected ({Object.keys(selectedRowIds).length})</ButtonCustom>
        </div>
      )}
      <DataTable
        columns={columns}
        formState={clientState}
        formAction={formAction}
        formRef={formRef}
        onRowSelectionChange={setSelectedRowIds}
      />
      <section className="flex">
        <CustomerEditForm openCallback={(func) => openCallbackFunc.current = func} onSaved={handleSave} />
      </section>
    </div>
  )
}