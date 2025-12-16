"use client";

import { useState } from "react";
import type { TeamMember, TeamMemberRole } from "@/types/database";
import { MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { removeTeamMember, updateTeamMemberRole } from "../actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export function TeamMemberRowActions({ member }: { member: TeamMember }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await removeTeamMember(member.id);
    setIsDeleting(false);

    if (result.success) {
      toast({ title: "Rimosso", description: result.success });
      router.refresh();
    } else {
      toast({ title: "Errore", description: result.error, variant: "destructive" });
    }
  }

  async function handleUpdateRole(newRole: TeamMemberRole) {
    setIsUpdatingRole(true);
    const result = await updateTeamMemberRole(member.id, newRole);
    setIsUpdatingRole(false);

    if (result.success) {
        toast({ title: "Ruolo Aggiornato", description: result.success });
        router.refresh();
    } else {
        toast({ title: "Errore", description: result.error, variant: "destructive" });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Azioni</DropdownMenuLabel>
          <DropdownMenuItem disabled={isUpdatingRole || member.role === "ADMIN"} onClick={() => handleUpdateRole("ADMIN")}>
            {isUpdatingRole && member.role !== "ADMIN" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rendi Admin
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isUpdatingRole || member.role === "EDITOR"} onClick={() => handleUpdateRole("EDITOR")}>
            {isUpdatingRole && member.role !== "EDITOR" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rendi Editor
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isUpdatingRole || member.role === "VIEWER"} onClick={() => handleUpdateRole("VIEWER")}>
            {isUpdatingRole && member.role !== "VIEWER" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rendi Viewer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Rimuovi
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Questa azione non può essere annullata. Rimuoverà permanentemente questo membro del team.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Rimuovi
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
