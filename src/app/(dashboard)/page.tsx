export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E1F20] rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Vendite Totali</h3>
          <div className="text-3xl text-white font-medium">€ 12.450,00</div>
          <div className="mt-2 text-green-400 text-sm font-medium">+15% vs mese scorso</div>
        </div>
        
        <div className="bg-[#1E1F20] rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Ordini</h3>
          <div className="text-3xl text-white font-medium">342</div>
          <div className="mt-2 text-gray-400 text-sm font-medium">Ultimi 30 giorni</div>
        </div>

        <div className="bg-[#1E1F20] rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Profitto Netto (Stimato)</h3>
          <div className="text-3xl text-[#A8C7FA] font-medium">€ 4.200,00</div>
           <div className="mt-2 text-indigo-300 text-sm font-medium">Margine medio 33%</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#1E1F20] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
             <h2 className="text-lg font-medium text-white">Ultimi Ordini</h2>
             <button className="text-[#A8C7FA] text-sm hover:underline">Vedi tutti</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#2D2E31] text-gray-400">
                <th className="px-6 py-3 font-medium">Ordine #</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Stato</th>
                <th className="px-6 py-3 font-medium text-right">Totale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
               {/* Placeholder Row 1 */}
              <tr className="hover:bg-[#2D2E31] transition-colors">
                <td className="px-6 py-4 text-white font-mono">#1024</td>
                <td className="px-6 py-4 text-gray-300">Mario Rossi</td>
                <td className="px-6 py-4 text-gray-400">17 Dic, 14:30</td>
                 <td className="px-6 py-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs border border-green-900">Completato</span>
                 </td>
                <td className="px-6 py-4 text-right text-white">€ 45,00</td>
              </tr>
               {/* Placeholder Row 2 */}
              <tr className="hover:bg-[#2D2E31] transition-colors">
                <td className="px-6 py-4 text-white font-mono">#1023</td>
                <td className="px-6 py-4 text-gray-300">Giulia Bianchi</td>
                <td className="px-6 py-4 text-gray-400">17 Dic, 12:15</td>
                 <td className="px-6 py-4">
                    <span className="bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-900">In lavorazione</span>
                 </td>
                <td className="px-6 py-4 text-right text-white">€ 89,90</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
