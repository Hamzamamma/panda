import { z } from 'zod';

export const InviteTeamMemberSchema = z.object({
  email: z.string().email('Email non valida'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']), // Updated to match DB roles
});

export type InviteTeamMemberFormValues = z.infer<typeof InviteTeamMemberSchema>;