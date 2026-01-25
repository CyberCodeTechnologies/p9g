
import * as React from "react";
import { InputWithLabel } from "../../../lib/components/web/react/uicustom/inputwithlabel";
import { FormState } from "@/core/types";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import TaskNewForm from "../forms/tasknewform";
import Task from "@/core/models/domain/Task";
import { SelectListSearch } from "@/core/constants";
import { SelectWithLabel } from "@/lib/components/web/react/uicustom/selectwithlabel";


interface DataTableProps {
  formState?: FormState
  formAction: (formData: FormData) => void
    formRef?: React.RefObject<HTMLFormElement | null>;
  isPending?: boolean
  userMap: Map<string, string>;
  departmentMap: Map<string, string>;
}

export default function TaskSearch({
    formState,
    formAction,
    formRef,
    isPending,
    userMap,
    departmentMap
  }: DataTableProps){

    const openCallbackFunc = React.useRef<{ openDialog: (open: boolean) => void } | undefined>(undefined);
    
    const [searchTitle, setSearchTitle] = React.useState("");
    const [searchDepartment, setSearchDepartment] = React.useState("");
    const [searchStatus, setSearchStatus] = React.useState("");
    const [searchAssignToUserId, setSearchAssignToUserId] = React.useState("");

    const handleSave = (task: Task) => {
          window.location.reload();
    };

    return (
        <div>
          <section aria-label="Task Search" className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
                <InputWithLabel size="md" label="Title" name="searchTitle" defaultValue={searchTitle} onBlur={(e) => setSearchTitle(e.target.value)} />
                <SelectWithLabel name="searchDepartment" label="Department" size="sm" labelPosition="top" items={new Map([["DEFAULT", "Show All"], ...departmentMap])}
                    value={searchDepartment} onValueChange={value => setSearchDepartment(value)}
                />
                <SelectWithLabel name="searchStatus" label="Status" size="sm" labelPosition="top" items={SelectListSearch.TASK_STATUS}
                    value={searchStatus} onValueChange={value => setSearchStatus(value)}
                />
                <SelectWithLabel name="searchAssignToUserId" label="Assign To" size="sm" labelPosition="top" items={new Map([["DEFAULT", "Show All"], ...userMap])}
                    value={searchAssignToUserId} onValueChange={value => setSearchAssignToUserId(value)}
                />
                <ButtonCustom variant={"black"} onClick={() => formRef?.current?.requestSubmit()}>Search</ButtonCustom>
                <ButtonCustom type="button" variant="green" onClick={() => { openCallbackFunc.current?.openDialog(true); }}>New Task</ButtonCustom>
                
            </div>
          </section>
          <section className="flex">
          <TaskNewForm openCallback={(func) => openCallbackFunc.current = func} onSaved={handleSave} userMap={userMap} departmentMap={departmentMap} />
        </section>
        </div>
    );
}
