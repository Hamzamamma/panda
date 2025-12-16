"use server";

export async function getMembershipTiers() {
  return { tiers: [] as any[], error: null as string | null };
}

export async function getMembershipTierById(id: string) {
  return { tier: null, error: null as string | null };
}

export async function createMembershipTier(data: any) {
  return { success: "Tier creato (Simulato)", error: null as string | null };
}

export async function updateMembershipTier(id: string, data: any) {
  return { success: "Tier aggiornato (Simulato)", error: null as string | null };
}

export async function deleteMembershipTier(id: string) {
  return { success: "Tier eliminato (Simulato)", error: null as string | null };
}

export async function subscribeToTier(tierId: string, userId?: string, userEmail?: string) {
  return { success: "Iscrizione completata (Simulata)", error: null as string | null };
}
