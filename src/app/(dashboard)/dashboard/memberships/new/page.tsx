import { MembershipForm } from "@/features/memberships/components/membership-form";

export default function NewMembershipTierPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crea Nuovo Livello</h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Definisci un nuovo livello di abbonamento con i suoi benefici e prezzo.
        </p>
      </div>
      <MembershipForm />
    </div>
  );
}
