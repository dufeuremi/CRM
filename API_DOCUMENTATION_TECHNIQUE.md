# 📘 Documentation Technique API - CRM Taskalys

> **Version:** 1.0
> **Date:** 2025-01-25
> **Pour:** Agent Gemini 3

---

## 🎯 Vue d'Ensemble

Le CRM Taskalys utilise **Supabase** comme backend, qui expose une API REST complète pour toutes les opérations CRUD sur la base de données.

---

## 🔑 Tokens d'Authentification

### Token Anonyme (ANON KEY)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteWZ3dWttenRvaGVsYWRkc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTk0NjgsImV4cCI6MjA3NDUzNTQ2OH0.VfPX_hF79hinKyDc4qTJ6IHZMiY82BUoBtsJg9uGpzc
```

**Caractéristiques:**
- 🔓 Token public (côté client)
- ✅ Accès en lecture/écriture selon les RLS policies
- ⏰ Expire le: 2074-05-35 (valide ~50 ans)
- 🛡️ Sécurisé par Row Level Security (RLS)

### URL de Base

```
https://umyfwukmztoheladdskl.supabase.co
```

---

## 📊 Structure de la Base de Données

### 1. Table `users`

**Description:** Gestion des utilisateurs du CRM

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID unique (clé primaire) |
| `created_at` | timestamp | Date de création |
| `first_name` | text | Prénom |
| `last_name` | text | Nom |
| `phone` | numeric | Téléphone |
| `email` | text | Email |
| `role` | text | Rôle (admin, BDR, etc.) |
| `avatar_url` | text | URL avatar |
| `password` | text | Mot de passe (hashé) |
| `uuid` | uuid | UUID unique |
| `mission` | text | Mission/Description |
| `profile_url` | text | URL du profil |

---

### 2. Table `crm_prospects`

**Description:** Gestion des prospects

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID unique |
| `created_at` | timestamp | Date de création |
| `first_name` | text | Prénom |
| `last_name` | text | Nom |
| `email` | text | Email |
| `phone` | text | Téléphone |
| `society` | text | Entreprise |
| `role` | text | Poste |
| `notes` | text | Notes |
| `called` | boolean | Appelé? |
| `user_id` | smallint | ID utilisateur assigné |
| `note` | text | Note complémentaire |
| `linkedin` | text | URL LinkedIn |
| `pipeline_status` | text | Statut pipeline |
| `conversion_date` | date | Date de conversion |
| `temperature` | smallint | Température (1-10) |
| `archived` | boolean | Archivé? |
| `activities` | text | Activités |
| `resume` | text | Résumé |
| `booked` | boolean | RDV booké? |
| `firm_id` | smallint | ID entreprise |
| `city` | text | Ville |
| `traitement_status` | text | Statut traitement |

---

### 3. Table `crm_calls`

**Description:** Historique des appels

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID unique |
| `date` | timestamp | Date/heure appel |
| `title` | text | Titre |
| `resume` | text | Résumé |
| `prospect_id` | smallint | ID prospect |
| `needs` | text | Besoins identifiés |
| `transcription` | text | Transcription |
| `duration` | smallint | Durée (secondes) |
| `user_id` | smallint | ID utilisateur |
| `temperature` | smallint | Température |
| `personal_note` | text | Note personnelle |
| `tools` | json | Outils utilisés |
| `bdr_performance` | json | Performance BDR (voir structure JSON) |
| `deposit_type` | text | Type dépôt |
| `status` | text | Statut |
| `booked` | boolean | RDV booké? |

**Structure JSON `bdr_performance`:**

```json
{
  "overall_score": 4,
  "criteria_scores": {
    "rapport_building": 5,
    "needs_discovery": 4,
    "objection_handling": 4,
    "pitch_clarity": 6,
    "closing_effort": 3
  },
  "strengths": [
    "Ton poli et professionnel",
    "Pitch avec proposition de valeur claire"
  ],
  "improvement_areas": [
    "Mieux qualifier en posant des questions ouvertes",
    "Adapter le discours à une petite structure"
  ]
}
```

---

### 4. Table `crm_activity_logs`

**Description:** Logs des activités utilisateur

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID unique |
| `created_at` | timestamp | Date/heure |
| `user_id` | smallint | ID utilisateur |
| `activity_type` | text | Type (login, logout, api_call, export) |
| `ip_address` | text | Adresse IP |
| `user_agent` | text | User-Agent |
| `details` | json | Détails supplémentaires |

---

### 5. Autres Tables

- **`calendars`**: Événements calendrier
- **`crm_firms`**: Entreprises
- **`crm_mails`**: Emails
- **`crm_tasks`**: Tâches

---

## 🔧 Utilisation de l'API

### Configuration Client

#### JavaScript (Supabase JS)

```javascript
const SUPABASE_URL = 'https://umyfwukmztoheladdskl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

#### Python

```python
import requests

SUPABASE_URL = "https://umyfwukmztoheladdskl.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}
```

#### cURL

```bash
SUPABASE_URL="https://umyfwukmztoheladdskl.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "${SUPABASE_URL}/rest/v1/users" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 📡 Exemples de Requêtes API

### 1. Lire Tous les Utilisateurs

**JavaScript:**

```javascript
const { data: users, error } = await supabase
  .from('users')
  .select('*');
```

**REST API (cURL):**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/users?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Python:**

```python
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/users?select=*",
    headers=headers
)
users = response.json()
```

---

### 2. Lire un Utilisateur Spécifique

**JavaScript:**

```javascript
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .single();
```

**REST API:**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/users?id=eq.1&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 3. Créer un Prospect

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .insert([
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0601020304',
      society: 'Acme Corp',
      user_id: 1
    }
  ])
  .select();
```

**REST API:**

```bash
curl -X POST \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0601020304",
    "society": "Acme Corp",
    "user_id": 1
  }'
```

**Python:**

```python
payload = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0601020304",
    "society": "Acme Corp",
    "user_id": 1
}

response = requests.post(
    f"{SUPABASE_URL}/rest/v1/crm_prospects",
    headers=headers,
    json=payload
)
```

---

### 4. Mettre à Jour un Prospect

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .update({ temperature: 8, booked: true })
  .eq('id', 123)
  .select();
```

**REST API:**

```bash
curl -X PATCH \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?id=eq.123" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 8, "booked": true}'
```

---

### 5. Supprimer un Prospect

**JavaScript:**

```javascript
const { error } = await supabase
  .from('crm_prospects')
  .delete()
  .eq('id', 123);
```

**REST API:**

```bash
curl -X DELETE \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?id=eq.123" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 6. Filtres Avancés

#### Filtrer par Multiple Conditions

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .select('*')
  .eq('user_id', 1)
  .eq('booked', false)
  .gte('temperature', 5)
  .order('created_at', { ascending: false });
```

**REST API:**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?user_id=eq.1&booked=eq.false&temperature=gte.5&order=created_at.desc&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

#### Recherche Texte (LIKE)

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .select('*')
  .ilike('first_name', '%john%');
```

**REST API:**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?first_name=ilike.*john*&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 7. Requêtes avec Relations (JOIN)

**JavaScript:**

```javascript
// Récupérer les appels avec les infos du prospect
const { data, error } = await supabase
  .from('crm_calls')
  .select(`
    *,
    crm_prospects (
      first_name,
      last_name,
      society,
      email
    )
  `)
  .eq('user_id', 1);
```

**REST API:**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_calls?user_id=eq.1&select=*,crm_prospects(first_name,last_name,society,email)" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 8. Pagination

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .select('*')
  .range(0, 9); // 10 premiers résultats
```

**REST API:**

```bash
curl -X GET \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?select=*&offset=0&limit=10" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 9. Compter les Résultats

**JavaScript:**

```javascript
const { count, error } = await supabase
  .from('crm_prospects')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', 1);
```

**REST API:**

```bash
curl -X HEAD \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects?user_id=eq.1&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Prefer: count=exact"
```

---

### 10. Upsert (Insert ou Update)

**JavaScript:**

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .upsert({
    id: 123,
    temperature: 9,
    booked: true
  })
  .select();
```

**REST API:**

```bash
curl -X POST \
  "https://umyfwukmztoheladdskl.supabase.co/rest/v1/crm_prospects" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{"id": 123, "temperature": 9, "booked": true}'
```

---

## 🔍 Opérateurs de Filtrage

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `eq` | Égal à | `?temperature=eq.5` |
| `neq` | Différent de | `?booked=neq.true` |
| `gt` | Supérieur à | `?temperature=gt.5` |
| `gte` | Supérieur ou égal | `?temperature=gte.5` |
| `lt` | Inférieur à | `?temperature=lt.5` |
| `lte` | Inférieur ou égal | `?temperature=lte.5` |
| `like` | LIKE (sensible à la casse) | `?first_name=like.John*` |
| `ilike` | LIKE (insensible) | `?first_name=ilike.john*` |
| `is` | IS NULL | `?notes=is.null` |
| `in` | IN (liste) | `?id=in.(1,2,3)` |
| `contains` | Contient (array) | `?tags=cs.{tag1,tag2}` |
| `or` | OU logique | `?or=(status.eq.open,status.eq.pending)` |
| `and` | ET logique | `?and=(status.eq.open,priority.eq.high)` |

---

## 📈 Cas d'Usage Courants

### Récupérer les Appels d'un Utilisateur avec Performance BDR

```javascript
const { data: calls, error } = await supabase
  .from('crm_calls')
  .select('*')
  .eq('user_id', 1)
  .not('bdr_performance', 'is', null)
  .order('date', { ascending: false });

// Calculer le score moyen
const avgScore = calls.reduce((sum, call) =>
  sum + (call.bdr_performance?.overall_score || 0), 0
) / calls.length;
```

---

### Récupérer les Prospects Chauds Non Bookés

```javascript
const { data: hotProspects, error } = await supabase
  .from('crm_prospects')
  .select('*')
  .gte('temperature', 7)
  .eq('booked', false)
  .eq('archived', false)
  .order('temperature', { ascending: false });
```

---

### Logger une Activité

```javascript
const { data, error } = await supabase
  .from('crm_activity_logs')
  .insert([{
    user_id: 1,
    activity_type: 'api_call',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    details: {
      endpoint: '/api/prospects',
      method: 'GET'
    }
  }]);
```

---

## 🛡️ Sécurité et Bonnes Pratiques

### 1. Row Level Security (RLS)

Supabase utilise RLS pour sécuriser les données. Les policies sont configurées au niveau de la base de données.

**Important:** Le token ANON KEY ne donne accès qu'aux données autorisées par les RLS policies.

### 2. Rate Limiting

- ⚠️ Limite: Variable selon le plan Supabase
- 💡 Recommandation: Implémenter un cache côté client pour réduire les requêtes

### 3. Gestion des Erreurs

```javascript
const { data, error } = await supabase
  .from('crm_prospects')
  .select('*');

if (error) {
  console.error('Erreur Supabase:', error.message);
  // Gérer l'erreur
} else {
  // Utiliser les données
}
```

### 4. Environnement

**⚠️ IMPORTANT:** Ne jamais exposer les tokens en production dans le code source.

**Recommandations:**
- Utiliser des variables d'environnement
- Configurer les RLS policies strictement
- Utiliser le Service Role Key uniquement côté serveur

---

## 📚 Ressources Supplémentaires

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase REST API Reference](https://supabase.com/docs/guides/api)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 🔗 Endpoints Principaux

| Endpoint | Description |
|----------|-------------|
| `/rest/v1/users` | Gestion utilisateurs |
| `/rest/v1/crm_prospects` | Gestion prospects |
| `/rest/v1/crm_calls` | Historique appels |
| `/rest/v1/crm_activity_logs` | Logs activités |
| `/rest/v1/calendars` | Événements calendrier |
| `/rest/v1/crm_firms` | Entreprises |
| `/rest/v1/crm_mails` | Emails |
| `/rest/v1/crm_tasks` | Tâches |

---

## ✅ Checklist pour Agent Gemini 3

- [ ] Token ANON KEY configuré
- [ ] URL de base Supabase configurée
- [ ] Headers d'authentification corrects
- [ ] Gestion des erreurs implémentée
- [ ] Respect des RLS policies
- [ ] Rate limiting pris en compte
- [ ] Cache implémenté si nécessaire
- [ ] Tests effectués sur environnement de dev

---

**Version:** 1.0
**Dernière mise à jour:** 2025-01-25
**Maintenu par:** Équipe CRM Taskalys
