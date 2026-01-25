"use server";

import { auth } from "@/app/auth";
import { container } from "@/core/di/dicontainer";
import IUserService from "@/core/services/contracts/IUserService";
import { TYPES } from "@/core/types";
import TaskList from "./tasklist";
import IRepository from "@/lib/repositories/IRepository";
import Config from "@/core/models/domain/Config";
import { ConfigGroup } from "@/core/constants";
import { eq } from "@/lib/transformers/types";

export default async function TaskListPage() {

  const session = await auth();
  
  let userOptions: [string, string][] = [];
  let departmentOptions: [string, string][] = [];
  
  if (session?.user) {
    const userService = container.get<IUserService>(TYPES.IUserService);
    // Fetch all users (large page size)
    const [users] = await userService.userFindMany(
      undefined as unknown as Record<string, any>, 
      { pageIndex: 0, pageSize: 1000, records: 0, pages: 0 }, 
      session.user
    );
    userOptions = users.map(u => [u.id, u.userName]);

    const configRepository = container.get<IRepository<Config>>(TYPES.IConfigRepository);
    const [departments] = await configRepository.findMany(eq("group", ConfigGroup.DEPARTMENT));
    departmentOptions = departments.map(d => [d.text, d.text]);
  }

  return (
    <TaskList userOptions={userOptions} departmentOptions={departmentOptions} />
  );
}
