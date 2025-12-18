# PANDA - Documentazione Progetto

**Data:** 18 Dicembre 2025
**Versione:** 2.0

---

## 1. Cos'è Panda

**Panda** è una dashboard per **Creator** (influencer, artisti) che vendono merchandising. Permette ai Creator di monitorare vendite, ordini e guadagni in modo semplice e trasparente.

### Il Problema
I Creator che vendono merch spesso ricevono solo report Excel o screenshot. Manca trasparenza e controllo diretto sui propri dati di vendita.

### La Soluzione
Una dashboard professionale, brandizzata "Panda", dove il Creator vede in tempo reale:
- Quanto sta vendendo
- Quali prodotti vanno meglio
- Quanto sta guadagnando
- Stato degli ordini

---

## 2. Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                      MEDUSA BACKEND                          │
│                    (localhost:9000)                          │
│                                                              │
│   • Gestione Prodotti, Ordini, Clienti                       │
│   • Pagamenti (Stripe)                                       │
│   • Database (Neon PostgreSQL)                               │
│   • API REST per tutti i dati e-commerce                     │
│                                                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ API
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    PANDA DASHBOARD                           │
│                   (localhost:3009)                           │
│                                                              │
│   • Frontend Next.js                                         │
│   • UI stile Medusa Admin                                    │
│   • Auth Creator con Supabase                                │
│   • Solo lettura dati (no modifiche critiche)                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Componenti

| Componente | Tecnologia | Ruolo |
|------------|------------|-------|
| **Medusa Backend** | Node.js + Medusa.js | E-commerce engine, API |
| **Panda Dashboard** | Next.js + React | UI per Creator |
| **Database E-commerce** | Neon PostgreSQL | Prodotti, ordini, clienti |
| **Auth Creator** | Supabase | Login/registrazione Creator |
| **Pagamenti** | Stripe (via Medusa) | Processare pagamenti |

---

## 3. Database

### Neon PostgreSQL (Medusa)
Contiene tutti i dati e-commerce:

| Tabella | Contenuto |
|---------|-----------|
| `product` | Prodotti in vendita |
| `order` | Ordini dei clienti |
| `customer` | Clienti che comprano |
| `payment` | Transazioni pagamenti |
| `cart` | Carrelli |
| `shipping` | Spedizioni |
| `discount` | Codici sconto |

**Connection String:**
```
postgresql://neondb_owner:npg_if4spZLMHN2g@ep-shy-sky-agmbwwb5-pooler.eu-central-1.aws.neon.tech/neondb
```

### Supabase (Auth)
Solo per autenticazione Creator:

| Tabella | Contenuto |
|---------|-----------|
| `auth.users` | Account Creator |
| `profiles` | Profili Creator |

---

## 4. Funzionalità Panda Dashboard

### Per il Creator

| Sezione | Funzionalità |
|---------|--------------|
| **Dashboard** | Overview vendite, ordini, guadagni |
| **Ordini** | Lista ordini (sola lettura) |
| **Prodotti** | Vedere prodotti in vendita |
| **Statistiche** | Grafici vendite, trend |
| **Guadagni** | Profitto netto, margini |
| **Profilo** | Impostazioni account |

### NON incluso (gestito da Medusa Admin)
- Creazione/modifica prodotti
- Gestione inventario
- Impostazioni pagamenti
- Configurazione spedizioni

---

## 5. Tech Stack

### Frontend (Panda)
- **Framework:** Next.js 16
- **UI Library:** @medusajs/ui, @medusajs/icons
- **Styling:** Tailwind CSS
- **State:** React Query
- **Auth:** Supabase Auth

### Backend (Medusa)
- **Framework:** Medusa.js
- **Database:** PostgreSQL (Neon)
- **Payments:** Stripe
- **Admin:** Medusa Admin Panel

---

## 6. Struttura File Panda

```
panda/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Route group dashboard
│   │   │   ├── layout.tsx      # Layout con sidebar
│   │   │   ├── dashboard/      # Pagina principale
│   │   │   ├── orders/         # Pagina ordini
│   │   │   └── products/       # Pagina prodotti
│   │   ├── globals.css         # Stili globali
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirect a dashboard
│   │
│   ├── components/             # Componenti UI riutilizzabili
│   │
│   ├── lib/                    # Utilities e client
│   │   ├── medusa-client.ts    # Client per Medusa API
│   │   ├── supabase.ts         # Client Supabase Auth
│   │   └── utils.ts            # Funzioni utility
│   │
│   ├── providers/              # Context providers
│   │
│   └── types/                  # TypeScript types
│
├── .env.local                  # Variabili ambiente
├── package.json
├── tailwind.config.ts
└── PANDA_DOCS.md              # Questo file
```

---

## 7. API Medusa

Panda comunica con Medusa tramite API REST.

### Endpoints principali

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/store/products` | GET | Lista prodotti |
| `/store/orders` | GET | Lista ordini |
| `/admin/orders` | GET | Ordini (admin) |
| `/admin/products` | GET | Prodotti (admin) |
| `/admin/customers` | GET | Clienti |

### Esempio chiamata

```typescript
// lib/medusa-client.ts
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
})

// Ottenere ordini
const { orders } = await medusa.admin.orders.list()
```

---

## 8. Come Avviare

### 1. Avviare Medusa Backend
```bash
cd C:/Users/hamza/medusa-store
npm run dev
# Aperto su http://localhost:9000
```

### 2. Avviare Panda Dashboard
```bash
cd C:/Users/hamza/panda
npm run dev
# Aperto su http://localhost:3009
```

### 3. Accessi

| Servizio | URL | Credenziali |
|----------|-----|-------------|
| Medusa Admin | http://localhost:9000/app | hamzalemzaroual7@gmail.com |
| Panda Dashboard | http://localhost:3009 | (da configurare) |
| Neon Database | console.neon.tech | Account Neon |
| Supabase | supabase.com | Account Supabase |

---

## 9. Prossimi Passi

1. **Costruire UI Dashboard** - Replicare stile Medusa Admin
2. **Integrare Medusa API** - Fetch dati reali
3. **Configurare Auth** - Login Creator con Supabase
4. **Aggiungere Statistiche** - Grafici con Tremor/Recharts
5. **Testing** - Testare con dati reali

---

## 10. Differenze Medusa Admin vs Panda

| Aspetto | Medusa Admin | Panda Dashboard |
|---------|--------------|-----------------|
| **Utente** | Proprietario piattaforma | Creator/Influencer |
| **Accesso** | Completo | Solo lettura |
| **Prodotti** | CRUD completo | Solo visualizzazione |
| **Ordini** | Gestione completa | Solo visualizzazione |
| **Impostazioni** | Tutte | Solo profilo |
| **Branding** | Medusa | Panda |

---

*Documento generato automaticamente - Panda Project*
