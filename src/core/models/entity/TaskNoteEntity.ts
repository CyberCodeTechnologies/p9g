import EntityBase from "../../../lib/models/entity/EntityBase";

export default class TaskNoteEntity extends EntityBase {
    public taskId: string = "";
    public content: string = "";
    public type: string = "NOTE";
}
