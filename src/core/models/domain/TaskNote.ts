import DomainBase from "@/lib/models/domain/DomainBase";

export default class TaskNote extends DomainBase {
  public taskId: string = "";
  public content: string = "";
  public type: string = "NOTE"; // NOTE, EMAIL, CHAT
}
