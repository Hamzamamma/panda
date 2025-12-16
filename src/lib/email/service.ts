// Placeholder for real email service like Resend, SendGrid, or AWS SES
// For MVP, we log to console.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log(`
  📧 SENDING EMAIL 📧
  To: ${to}
  Subject: ${subject}
  ---------------------
  ${html}
  ---------------------
  `);
  
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
}

export const EmailTemplates = {
  orderConfirmation: (orderNumber: number | string, total: number, items: any[] = []) => `
    <h1>Grazie per il tuo ordine!</h1>
    <p>Il tuo ordine #${orderNumber} è stato confermato.</p>
    <p>Totale pagato: €${total.toFixed(2)}</p>
    <h3>Riepilogo:</h3>
    <ul>
      ${items.map(i => `<li>${i.quantity}x ${i.title}</li>`).join('')}
    </ul>
    <p>Lo spediremo al più presto.</p>
  `,
  
  shippingConfirmation: (orderNumber: number | string, trackingNumber?: string, trackingCompany?: string, trackingUrl?: string) => `
    <h1>Il tuo ordine #${orderNumber} è stato spedito!</h1>
    <p>Siamo felici di informarti che il tuo ordine è stato spedito.</p>
    ${trackingNumber ? `<p>Numero di tracking: <strong>${trackingNumber}</strong></p>` : ''}
    ${trackingCompany ? `<p>Corriere: <strong>${trackingCompany}</strong></p>` : ''}
    ${trackingUrl ? `<p>Segui il tuo pacco qui: <a href="${trackingUrl}">${trackingUrl}</a></p>` : ''}
    <p>Grazie per aver acquistato da noi!</p>
  `,

  welcomeMember: (tierName: string) => `
    <h1>Benvenuto nel Club!</h1>
    <p>Grazie per esserti iscritto al livello <strong>${tierName}</strong>.</p>
    <p>Accedi subito alla tua dashboard per vedere i contenuti esclusivi.</p>
  `,

  broadcast: (content: string) => `
    <div style="font-family: sans-serif; color: #333;">
      ${content}
      <hr />
      <small>Hai ricevuto questa email perché segui PANDA Store.</small>
    </div>
  `
};
