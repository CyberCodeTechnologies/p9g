
import * as React from "react";
import { InputWithLabel } from "../../../lib/components/web/react/uicustom/inputwithlabel";
import { FormState } from "@/core/types";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import CustomerNewForm from "../forms/customernewform";
import Customer from "@/core/models/domain/Customer";
import { customerExport } from "@/app/(private)/console/customers/actions";
import { toast } from "sonner";


interface DataTableProps {
  formState?: FormState
  formAction: (formData: FormData) => void
    formRef?: React.RefObject<HTMLFormElement | null>;
  isPending?: boolean
}

export default function CustomerSearch({
    formState,
    formAction,
    formRef,
    isPending
  }: DataTableProps){

    const openCallbackFunc = React.useRef<{ openDialog: (open: boolean) => void } | undefined>(undefined);
    
    const [searchId, setSearchId] = React.useState("");
    const [searchName, setSearchName] = React.useState("");
    const [searchNationalId, setSearchNationalId] = React.useState("");
    const [searchPassport, setSearchPassport] = React.useState("");
    const [searchPhone, setSearchPhone] = React.useState("");

    const handleSave = (customer: Customer) => {
          window.location.reload();
    };

    const handleExport = async () => {
      if (!formRef?.current) return;
      
      try {
        const formData = new FormData(formRef.current);
        const csvContent = await customerExport(formData);
        
        if (csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Export successful");
        } else {
            toast.error("Export failed or no data found");
        }
      } catch (e) {
        toast.error("Export error");
      }
    };

    return (
        <div>
          <section aria-label="CheckIn Search" className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
                <InputWithLabel size="md" label="Id" name="searchId" defaultValue={searchId} onBlur={(e) => setSearchId(e.target.value)} />
                <InputWithLabel size="md" label="Guest Name" name="searchName" defaultValue={searchName} onBlur={(e) => setSearchName(e.target.value)} />
                <InputWithLabel size="md" label="National ID" name="searchNationalId" defaultValue={searchNationalId} onBlur={(e) => setSearchNationalId(e.target.value)} />
                <InputWithLabel size="sm" label="Passport"  name="searchPassport" defaultValue={searchPassport} onBlur={(e) => setSearchPassport(e.target.value)} />
                <InputWithLabel size="sm" label="Phone"  name="searchPhone" defaultValue={searchPhone} onBlur={(e) => setSearchPhone(e.target.value)} />
                <ButtonCustom variant={"black"} onClick={() => formRef?.current?.requestSubmit()}>Search</ButtonCustom>
                <ButtonCustom type="button" variant="green" onClick={() => { openCallbackFunc.current?.openDialog(true); }}>New Customer</ButtonCustom>
                <ButtonCustom type="button" variant="gray" onClick={handleExport}>Export</ButtonCustom>
                
            </div>
          </section>
          <section className="flex">
          <CustomerNewForm openCallback={(func) => openCallbackFunc.current = func} onSaved={handleSave} />
        </section>
        </div>
    );
}
