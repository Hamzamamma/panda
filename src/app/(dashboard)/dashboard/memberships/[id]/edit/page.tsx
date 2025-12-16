import { getMembershipTierById } from "@/features/memberships/actions";
import { MembershipForm } from "@/features/memberships/components/membership-form";
import { notFound } from "next/navigation";

export default async function EditMembershipTierPage({ params }: { params: { id: string } }) {
    const { tier } = await getMembershipTierById(params.id);

    if (!tier) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Modifica Livello</h1>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Aggiorna i dettagli del livello di abbonamento esistente.
                </p>
            </div>
            <MembershipForm initialData={tier} />
        </div>
    );
}
