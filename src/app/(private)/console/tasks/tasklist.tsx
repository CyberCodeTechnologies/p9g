"use client";
import { useActionState, useEffect } from "react";

import { toast } from "sonner";
import { Group, GroupContent, GroupTitle } from "@/lib/components/web/react/uicustom/group";
import TaskSearch from "@/app/components/searchs/tasksearch";
import { taskGetList } from "./actions";
import React from "react";
import { Loader } from "@/lib/components/web/react/uicustom/loader";
import TaskTable from "@/app/components/tables/tasktable";

interface TaskListProps {
  userOptions: [string, string][];
  departmentOptions: [string, string][];
}

export default function TaskList({ userOptions, departmentOptions }: TaskListProps) {

  const formRef = React.useRef<HTMLFormElement>(null);
  const userMap = new Map(userOptions);
  const departmentMap = new Map(departmentOptions);

  const [state, formAction, isPending] = useActionState(taskGetList, {
    error: false,
    message: "",
    data: [],
    pager: {
      pageIndex: 0,
      pageSize: 10,
      records: 0,
      pages: 0
    }
  });

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
  }, [state]);

  return (
    <div className="flex flex-1 w-auto">
      <Loader isLoading={isPending} />
      <Group className="flex flex-1 w-auto">
        <GroupTitle>
          Task List
        </GroupTitle>
        <GroupContent>
          <div className="flex flex-col gap-4">
            <form ref={formRef} action={formAction} className="flex flex-col gap-4">
              <TaskSearch formAction={formAction} formRef={formRef} userMap={userMap} departmentMap={departmentMap} />
              <TaskTable formState={state} formAction={formAction} formRef={formRef} userMap={userMap} departmentMap={departmentMap} />
            </form>
          </div>
        </GroupContent>
      </Group>
    </div>
  );
}
