import { NextResponse, NextRequest } from "next/server";
import { container } from "@/core/di/dicontainer";
import { TYPES, SearchParam } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import { taskValidator, pagerValidator, searchValidator } from "@/core/validators/zodschema";
import { HttpStatusCode } from "@/core/constants";
import { getPagerWithDefaults } from "@/core/helpers";
import ITaskService from "@/core/services/contracts/ITaskService";
import Task from "@/core/models/domain/Task";
import { CustomError } from "@/lib/errors";
import ILogService from "@/core/services/contracts/ILogService";
import { auth } from "@/app/auth";


export async function GET(request: NextRequest) {
  try {
    c.fs("GET /api/tasks");
    c.d(JSON.stringify(request));

    const session = await auth();
    if(!session?.user)
        throw new CustomError('Invalid session');

    //retrieve search params from request
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    c.d(JSON.stringify(searchParams));

    //validate search params
    const searchValidatedFields = await searchValidator.safeParseAsync(searchParams);
    c.d(JSON.stringify(searchValidatedFields));

    //no need to validate pager params, if not valid, will use defaults
    const pagerValidatedFields = await pagerValidator.safeParseAsync(searchParams);
    c.d(JSON.stringify(pagerValidatedFields));
    const pager = getPagerWithDefaults(pagerValidatedFields.data);
    c.d(JSON.stringify(pager));

    //call service to retrieve data
    const taskService = container.get<ITaskService>(TYPES.ITaskService);
    const result = await taskService.taskFindMany(searchValidatedFields.data, pager, session.user);
    c.d(JSON.stringify(result));

    pager.records = result[1];
    pager.pages = Math.ceil(pager.records / pager.pageSize);
    return NextResponse.json({ data: {tasks:result[0], pager: {...pager, records:result[1]}} }, { status: HttpStatusCode.Ok });
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


export async function POST(request: NextRequest) {
  try {
    c.fs("POST api/tasks");
    c.i("Retrieving post body.")
    const body = await request.json();
    c.d(body);

    const session = await auth();
    if(!session?.user)
      throw new CustomError('Invalid session');

    c.i("Validating post data.");
    const validatedTask = await taskValidator.safeParseAsync(body);

    if (!validatedTask.success) {
      c.d("Task data is invalid. Return result.");
      c.d(validatedTask.error.flatten().fieldErrors);
      return NextResponse.json({ message: "Invalid input." }, { status: HttpStatusCode.BadRequest });
    }

    // update user
    c.i("Calling service.");
    const taskService = container.get<ITaskService>(TYPES.ITaskService);
    const createdTask = await taskService.taskCreate(validatedTask.data as unknown as Task, session.user);
    if (!createdTask) {
      c.d("Task creation failed. Return result.");
      return NextResponse.json({ message: "Create failed." }, { status: HttpStatusCode.ServerError });
    }

    c.i("Everything is fine. Return final result.");
    return NextResponse.json({ message: "Created", data: createdTask }, { status: HttpStatusCode.Created });
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
