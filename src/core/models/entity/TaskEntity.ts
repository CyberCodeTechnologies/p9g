import EntityBase from "@/lib/models/entity/EntityBase";

export default class TaskEntity extends EntityBase {
  public title: string = "";
  public description: string | null = null;
  public department: string | null = null;
  public notes: string | null = null;
  public status: string = "";
  public assignToUserId: string | null = null;
  public dueDate: Date | null = null;
}
