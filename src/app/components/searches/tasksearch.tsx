"use client"

import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom";
import { InputCustom } from "@/lib/components/web/react/uicustom/inputcustom";
import { SelectCustom } from "@/lib/components/web/react/uicustom/selectcustom";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { SelectListSearch } from "@/core/constants";

export default function TaskSearch({ userMap, departmentMap }: { userMap: Map<string, string>, departmentMap: Map<string, string> }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (formData: FormData) => {
        const params = new URLSearchParams(searchParams);
        
        const setParam = (key: string, value: any) => {
            if (value && value !== 'DEFAULT') params.set(key, value);
            else params.delete(key);
        };

        setParam('searchTitle', formData.get('searchTitle'));
        setParam('searchDepartment', formData.get('searchDepartment'));
        setParam('searchStatus', formData.get('searchStatus'));
        setParam('searchAssignedTo', formData.get('searchAssignedTo'));
        setParam('searchDueDate', formData.get('searchDueDate'));

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <form action={handleSearch} className="flex flex-wrap gap-2 items-end mb-4">
            <div className="w-40">
                <InputCustom name="searchTitle" label="Title" defaultValue={searchParams.get('searchTitle') || ''} placeholder="Title..." />
            </div>
            <div className="w-40">
                <SelectCustom name="searchDepartment" label="Department" options={departmentMap} defaultValue={searchParams.get('searchDepartment') || 'DEFAULT'} />
            </div>
            <div className="w-32">
                <SelectCustom name="searchStatus" label="Status" options={new Map([['DEFAULT', 'All'], ['Open', 'Open'], ['Done', 'Done'], ['Closed', 'Closed']])} defaultValue={searchParams.get('searchStatus') || 'DEFAULT'} />
            </div>
            <div className="w-40">
                <SelectCustom name="searchAssignedTo" label="Assigned To" options={userMap} defaultValue={searchParams.get('searchAssignedTo') || 'DEFAULT'} />
            </div>
            <div className="w-40">
                <InputCustom name="searchDueDate" label="Due Date" type="date" defaultValue={searchParams.get('searchDueDate') || ''} />
            </div>
            <ButtonCustom type="submit">Search</ButtonCustom>
        </form>
    );
}
