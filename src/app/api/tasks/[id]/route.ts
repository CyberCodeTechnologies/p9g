import { NextRequest, NextResponse } from "next/server";
import { container } from "@/core/di/dicontainer";
import { TYPES } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import ITaskService from "@/core/services/contracts/ITaskService";
import { taskValidator } from "@/core/validators/zodschema";
import { HttpStatusCode } from "@/core/constants";
import Task from "@/core/models/domain/Task";
import { CustomError } from "@/lib/errors";
import ILogService from "@/core/services/contracts/ILogService";
import { auth } from "@/app/auth";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        c.fs("GET /api/tasks/[id]");
        c.d(JSON.stringify(await params));
        const session = await auth();
        if(!session?.user)
            throw new CustomError('Invalid session');

        const { id } = await params;
        const service = container.get<ITaskService>(TYPES.ITaskService);
        const result = await service.taskFindById(id, session.user);
        if (!result) {
            return NextResponse.json({ message: "Not found." }, { status: HttpStatusCode.NotFound });
        }
        return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        c.e(error instanceof Error ? error.message : String(error));
        const logService = container.get<ILogService>(TYPES.ILogService);
        await logService.logError(error);
        if (error instanceof CustomError)
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        else
            return NextResponse.json({ message: "Unknow error occured." }, { status: HttpStatusCode.ServerError });
    }
}


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        c.fs("PUT api/tasks/[id]");
        const session = await auth();
        if(!session?.user)
            throw new CustomError('Invalid session');
        const body = await request.json();
        c.d(body);
        const { id } = await params;
        const service = container.get<ITaskService>(TYPES.ITaskService);
        // find existing task
        const task = await service.taskFindById(id,session.user);
        if (!task) {
            return NextResponse.json({ message: "Not found." }, { status: HttpStatusCode.NotFound });
        }

        const validatedTask = await taskValidator.safeParseAsync(body);

        if (!validatedTask) {
            return NextResponse.json({ message: "Invalid input" }, { status: HttpStatusCode.BadRequest });
        }
        c.d(validatedTask.data);
        // update task
        await service.taskUpdate(id, validatedTask.data as unknown as Task, session.user);
        return NextResponse.json({ message: "Updated" }, { status: HttpStatusCode.Ok });
    } catch (error) {
        c.e(error instanceof Error ? error.message : String(error));
        const logService = container.get<ILogService>(TYPES.ILogService);
        await logService.logError(error);
        if (error instanceof CustomError)
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        else
            return NextResponse.json({ message: "Unknow error occured." }, { status: HttpStatusCode.ServerError });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if(!session?.user)
            throw new CustomError('Invalid session');

        const { id } = await params;
        const service = container.get<ITaskService>(TYPES.ITaskService);
        await service.taskDelete(id, session.user);
        return NextResponse.json({ message: "Deleted" }, { status: HttpStatusCode.Ok });
    } catch (error) {
        c.e(error instanceof Error ? error.message : String(error));
        const logService = container.get<ILogService>(TYPES.ILogService);
        await logService.logError(error);
        if (error instanceof CustomError)
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        else
            return NextResponse.json({ message: "Unknow error occured." }, { status: HttpStatusCode.ServerError });
    }
}
