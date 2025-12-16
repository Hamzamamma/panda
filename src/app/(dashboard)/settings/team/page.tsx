import { getTeamMembers } from "@/features/team/actions";
import { InviteTeamDialog } from "@/features/team/components/invite-team-dialog";
import { TeamMemberRowActions } from "@/features/team/components/team-member-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function TeamSettingsPage() {
  const { members, error } = await getTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Membri del Team</h1>
            <p className="text-muted-foreground">Gestisci chi ha accesso alla dashboard.</p>
        </div>
        <InviteTeamDialog />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Aggiunto il</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members && members.length > 0 ? (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(member.createdAt), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <TeamMemberRowActions member={member} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nessun membro del team trovato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
