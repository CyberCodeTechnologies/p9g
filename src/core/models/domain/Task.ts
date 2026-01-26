import DomainBase from "@/lib/models/domain/DomainBase";

export default class Task extends DomainBase {
  public title: string = "";
  public description: string | null = null;
  public department: string | null = null;
  public notes: string | null = null;
  public status: string = "";
  public assignToUserId: string | null = null;
  public dueDate: Date | null = null;
}
