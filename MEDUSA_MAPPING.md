# MAPPATURA MEDUSA ADMIN → PANDA

## Pagine Medusa Admin (analizzate dal codice)

### 🏠 HOME / DASHBOARD
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| Home | Overview: vendite, ordini recenti, grafici | ✅ Base |

### 📦 ORDERS (Ordini)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/orders` | Lista ordini, filtri, ricerca, export | ✅ Base |
| `/orders/:id` | Dettaglio singolo ordine | ❌ Manca |
| Order Timeline | Storia ordine (eventi, note) | ❌ Manca |
| Order Fulfillment | Creare spedizione | ❌ Manca |
| Order Return | Gestire resi | ❌ Manca |
| Order Refund | Rimborsi | ❌ Manca |
| Order Exchange | Cambi | ❌ Manca |
| Order Claim | Reclami | ❌ Manca |

### 👕 PRODUCTS (Prodotti)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/products` | Lista prodotti, filtri, ricerca | ✅ Base |
| `/products/:id` | Dettaglio prodotto | ❌ Manca |
| Product Variants | Varianti, stock, prezzi | ❌ Manca |
| Product Media | Immagini prodotto | ❌ Manca |
| Product Attributes | Metadata | ❌ Manca |
| Product Create | Form creazione | ❌ Manca |
| Product Edit | Form modifica | ❌ Manca |
| Product Import | Import bulk | ❌ Manca |
| Product Export | Export CSV | ❌ Manca |

### 📁 CATEGORIES (Categorie)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/categories` | Lista categorie gerarchica | ❌ Manca |
| `/categories/:id` | Dettaglio categoria | ❌ Manca |
| Category Products | Prodotti nella categoria | ❌ Manca |
| Category Organize | Riordinare gerarchia | ❌ Manca |

### 🗂️ COLLECTIONS (Collezioni)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/collections` | Lista collezioni | ❌ Manca |
| `/collections/:id` | Dettaglio collezione | ❌ Manca |
| Collection Products | Gestire prodotti | ❌ Manca |

### 📊 INVENTORY (Inventario)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/inventory` | Lista items inventario | ❌ Manca |
| `/inventory/:id` | Dettaglio item | ❌ Manca |
| Inventory Stock | Stock per location | ❌ Manca |
| Reservations | Prenotazioni stock | ❌ Manca |

### 👥 CUSTOMERS (Clienti)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/customers` | Lista clienti, filtri | ❌ Manca |
| `/customers/:id` | Dettaglio cliente | ❌ Manca |
| Customer Orders | Ordini del cliente | ❌ Manca |
| Customer Groups | Gruppi clienti | ❌ Manca |

### 💰 PRICE LISTS (Listini Prezzi)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/price-lists` | Lista listini | ❌ Manca |
| `/price-lists/:id` | Dettaglio listino | ❌ Manca |
| Price List Products | Prezzi speciali | ❌ Manca |

### 🎁 PROMOTIONS (Promozioni)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| `/promotions` | Lista promozioni | ⚠️ Sidebar |
| `/promotions/:id` | Dettaglio promozione | ❌ Manca |
| Promotion Rules | Regole e condizioni | ❌ Manca |
| Campaigns | Campagne marketing | ❌ Manca |

### ⚙️ SETTINGS (Impostazioni)
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| Store Settings | Nome, valute, lingue | ❌ Manca |
| Regions | Regioni e paesi | ❌ Manca |
| Tax Settings | Tasse per regione | ❌ Manca |
| Sales Channels | Canali vendita | ❌ Manca |
| Locations | Magazzini/stock locations | ❌ Manca |
| Shipping Profiles | Profili spedizione | ❌ Manca |
| Users | Gestione utenti admin | ❌ Manca |
| API Keys | Chiavi API | ❌ Manca |
| Return Reasons | Motivi reso | ❌ Manca |
| Refund Reasons | Motivi rimborso | ❌ Manca |

### 🏷️ ALTRI
| Pagina | Funzionalità | Stato Panda |
|--------|--------------|-------------|
| Product Tags | Tag prodotti | ❌ Manca |
| Product Types | Tipi prodotto | ❌ Manca |
| Profile | Profilo utente | ❌ Manca |
| Workflows | Esecuzioni workflow | ❌ Manca |

---

## RIEPILOGO STATO

| Categoria | Pagine Totali | ✅ OK | ❌ Mancanti |
|-----------|---------------|-------|-------------|
| Home | 1 | 1 | 0 |
| Orders | 8 | 1 | 7 |
| Products | 9 | 1 | 8 |
| Categories | 4 | 0 | 4 |
| Collections | 3 | 0 | 3 |
| Inventory | 4 | 0 | 4 |
| Customers | 4 | 0 | 4 |
| Price Lists | 3 | 0 | 3 |
| Promotions | 4 | 0 | 4 |
| Settings | 10 | 0 | 10 |
| Altri | 4 | 0 | 4 |
| **TOTALE** | **54** | **3** | **51** |

---

## PRIORITÀ IMPLEMENTAZIONE

### 🔴 ALTA PRIORITÀ (Core per Creator)
1. **Order Detail** `/orders/:id` - Vedere dettagli ordine
2. **Product Detail** `/products/:id` - Vedere dettagli prodotto
3. **Customers List** `/customers` - Lista clienti
4. **Analytics Dashboard** - Grafici vendite migliorati

### 🟡 MEDIA PRIORITÀ
5. Categories
6. Collections
7. Inventory overview
8. Customer Detail

### 🟢 BASSA PRIORITÀ
9. Settings completi
10. Price Lists
11. Promotions
12. Workflows

---

*Generato analizzando: C:/Users/hamza/medusa-store/node_modules/@medusajs/dashboard*
