"use client"
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/lib/components/web/react/ui/dialog';
import { ButtonCustom } from '@/lib/components/web/react/uicustom/buttoncustom';
import { Textarea } from '@/lib/components/web/react/ui/textarea';
import TaskNote from '@/core/models/domain/TaskNote';
import { getTaskNotes, createTaskNote } from '@/app/(private)/console/tasks/taskNoteActions';

interface TaskNotesDialogProps {
  isOpen: boolean;
  taskId: string;
  onOpenChanged: (open: boolean) => void;
  userMap: Map<string, string>;
}

export default function TaskNotesDialog({
  isOpen,
  taskId,
  onOpenChanged,
  userMap
}: TaskNotesDialogProps) {
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadNotes();
    }
  }, [isOpen, taskId]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const fetchedNotes = await getTaskNotes(taskId);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    try {
      const createdNote = await createTaskNote(taskId, newNote);
      setNotes([createdNote, ...notes]);
      setNewNote("");
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeBadge = (type: string) => {
    let classes = "text-[10px] px-2 py-0.5 rounded-full font-semibold ";
    switch (type) {
      case 'EMAIL':
        classes += "bg-blue-100 text-blue-800";
        break;
      case 'CHAT':
        classes += "bg-green-100 text-green-800";
        break;
      default:
        classes += "bg-gray-100 text-gray-800";
    }
    return <span className={classes}>{type}</span>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChanged}>
        <DialogContent className="flex flex-col min-w-[70vw] h-[80vh]">
            <DialogHeader>
                <DialogTitle>Task Notes</DialogTitle>
                <DialogDescription>History of notes, emails, and chats.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-auto border rounded p-4 flex flex-col gap-4">
                {isLoading ? (
                    <div>Loading notes...</div>
                ) : (
                    notes.length === 0 ? <div className="text-muted-foreground text-center">No notes yet.</div> :
                    notes.map((note) => (
                        <div key={note.id} className="border-b pb-2 last:border-b-0">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1 items-center">
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold">{userMap.get(note.createdBy) || note.createdBy}</span>
                                    {getTypeBadge(note.type)}
                                </div>
                                <span>{new Date(note.createdAtUTC).toLocaleString()}</span>
                            </div>
                            <div className="whitespace-pre-wrap">{note.content}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a new note..."
                    rows={3}
                />
                <div className="flex justify-end">
                    <ButtonCustom variant="default" onClick={handleSave} disabled={isSaving || !newNote.trim()}>
                        {isSaving ? "Saving..." : "Add Note"}
                    </ButtonCustom>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}
