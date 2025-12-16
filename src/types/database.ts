// Force update
export const _force_update = true;

export type TeamMemberRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  role: TeamMemberRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type MembershipStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface MembershipTier {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  currency: string;
  benefits: string[];
  status: MembershipStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
    id: string;
    orderNumber: number;
    customerName: string;
    customerEmail: string;
    total: number | string;
    status: OrderStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
}