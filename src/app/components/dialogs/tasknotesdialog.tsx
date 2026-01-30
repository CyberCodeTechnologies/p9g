"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { getTaskNotes, createTaskNote } from "../../../(private)/console/tasks/taskNoteActions";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/core/helpers";

interface TaskNotesDialogProps {
    isOpen: boolean;
    taskId: string;
    onOpenChanged: (open: boolean) => void;
    userMap: Map<string, string>;
}

export default function TaskNotesDialog({ isOpen, taskId, onOpenChanged, userMap }: TaskNotesDialogProps) {
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (isOpen && taskId) {
            setLoading(true);
            getTaskNotes(taskId).then(res => {
                setNotes(res);
                setLoading(false);
            });
        }
    }, [isOpen, taskId]);

    const handleSave = async () => {
        if (!newNote.trim()) return;
        await createTaskNote(taskId, newNote, "NOTE");
        setNewNote("");
        const updated = await getTaskNotes(taskId);
        setNotes(updated);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChanged}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Task Notes</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4 space-y-4">
                    {loading ? <div className="text-center">Loading...</div> : notes.map((note: any) => (
                        <div key={note.id} className="border-b pb-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{userMap.get(note.createdBy) || "Unknown"}</span>
                                <span>{formatDateTime(note.createdAtUTC)}</span>
                            </div>
                            <div className="mt-1 flex items-start gap-2">
                                <Badge variant="outline" className={
                                    note.type === 'EMAIL' ? 'bg-yellow-100' :
                                    note.type === 'CHAT' ? 'bg-blue-100' : 'bg-gray-100'
                                }>{note.type}</Badge>
                                <p className="whitespace-pre-wrap">{note.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." />
                    <ButtonCustom onClick={handleSave}>Add</ButtonCustom>
                </div>
            </DialogContent>
        </Dialog>
    );
}
