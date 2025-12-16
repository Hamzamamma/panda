import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const n8nWebhookUrl = 'http://localhost:5678/webhook/panda-events';
    
    // Esempio di payload da inviare a N8N
    const payload = {
      event: 'TestEventFromPanda',
      data: {
        message: 'Ciao da Next.js (Panda)!',
        timestamp: new Date().toISOString(),
        origin: 'panda-platform',
      },
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Errore N8N webhook: ${response.status} - ${errorText}`);
      return NextResponse.json({ message: 'Errore nell\'invio a N8N', error: errorText }, { status: response.status });
    }

    const n8nResponse = await response.json();
    console.log('Risposta da N8N:', n8nResponse);

    return NextResponse.json({ message: 'Evento inviato a N8N con successo!', n8nResponse });
  } catch (error: any) {
    console.error('Errore durante l\'invio dell\'evento a N8N:', error);
    return NextResponse.json({ message: 'Errore interno del server', error: error.message }, { status: 500 });
  }
}
