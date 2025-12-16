"use server";

import { mockDB } from "@/lib/mock-db";

export async function getTeamMembers() {
  return { members: mockDB.members, error: null as string | null };
}

export async function inviteTeamMember(data: any) {
  return { success: "Invito inviato (Simulato)", error: null as string | null };
}

export async function removeTeamMember(id: string) {
  return { success: "Membro rimosso (Simulato)", error: null as string | null };
}

export async function updateTeamMemberRole(id: string, role: string) {
  return { success: "Ruolo aggiornato (Simulato)", error: null as string | null };
}