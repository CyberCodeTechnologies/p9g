import { auth } from "@/app/auth";
import { container } from "@/core/di/dicontainer";
import { TYPES } from "@/core/types";
import ITaskService from "@/core/services/contracts/ITaskService";
import TaskTable from "../../../../components/tables/tasktable";
import TaskNewForm from "../../../../components/forms/tasknewform";
import TaskSearch from "../../../../components/searches/tasksearch";
import IUserService from "@/core/services/contracts/IUserService";
import IConfigRepository from "@/core/repositories/contracts/IConfigRepository";
import { ConfigGroup } from "@/core/constants";
import { eq, like, AnyCondition } from "@/lib/transformers/types";

export default async function TaskListPage({ searchParams }: { searchParams: any }) {
    const session = await auth();
    if (!session || !session.user) return <div>Unauthorized</div>;

    const service = container.get<ITaskService>(TYPES.ITaskService);
    const userService = container.get<IUserService>(TYPES.IUserService);
    const configRepo = container.get<IConfigRepository>(TYPES.IConfigRepository);

    // Fetch master data
    const users = await userService.getAll();
    const userMap = new Map<string, string>();
    users.forEach(u => userMap.set(u.id, u.name));

    const departments = await configRepo.getByGroup(ConfigGroup.DEPARTMENT);
    const departmentMap = new Map<string, string>();
    departments.forEach(d => departmentMap.set(d.value, d.text));

    // Build search conditions
    const conditions: AnyCondition[] = [];
    
    if (searchParams.searchTitle) {
        conditions.push(like('title', `%${searchParams.searchTitle}%`));
    }
    if (searchParams.searchDepartment && searchParams.searchDepartment !== 'DEFAULT') {
        conditions.push(eq('department', searchParams.searchDepartment));
    }
    if (searchParams.searchStatus && searchParams.searchStatus !== 'DEFAULT') {
        conditions.push(eq('status', searchParams.searchStatus));
    }
    if (searchParams.searchAssignedTo && searchParams.searchAssignedTo !== 'DEFAULT') {
        conditions.push(eq('assignToUserId', searchParams.searchAssignedTo));
    }
    if (searchParams.searchDueDate) {
        conditions.push(eq('dueDate', searchParams.searchDueDate));
    }

    const tasks = await service.getByComplexConditions(conditions);

    // Serialize data
    const serializedTasks = JSON.parse(JSON.stringify(tasks));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            <div className="flex justify-between items-end mb-4">
                <TaskSearch userMap={userMap} departmentMap={departmentMap} />
                <TaskNewForm userMap={userMap} departmentMap={departmentMap} />
            </div>
            <TaskTable data={serializedTasks} userMap={userMap} departmentMap={departmentMap} />
        </div>
    );
}
