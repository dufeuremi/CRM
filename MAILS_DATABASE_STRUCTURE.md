# Structure de la table `crm_mails`

## Schema Supabase

```sql
CREATE TABLE crm_mails (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  sender TEXT,
  sender_id SMALLINT,
  recipient TEXT,
  recipient_id SMALLINT,
  object TEXT,
  html_body TEXT,
  attachment TEXT,
  date TIMESTAMP WITH TIME ZONE,
  type TEXT,
  category TEXT
);
```

## Description des colonnes

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| `id` | bigint | Identifiant unique du mail | `1` |
| `created_at` | timestamp | Date de création dans la base | `2025-11-10T14:30:00Z` |
| `sender` | text | Adresse email de l'expéditeur | `"nparent@taskalys.fr"` |
| `sender_id` | smallint | ID de l'utilisateur expéditeur | `5` |
| `recipient` | text | Adresse email du destinataire | `"dupont@entreprise.fr"` |
| `recipient_id` | smallint | ID de l'utilisateur destinataire | `12` |
| `object` | text | Objet du mail | `"Présentation Taskalys"` |
| `html_body` | text | Corps du mail en HTML | `"<div>...</div>"` |
| `attachment` | text | Pièces jointes (JSON stringifié) | `"[{\"name\":\"doc.pdf\",\"size\":1024}]"` |
| `date` | timestamp | Date d'envoi/réception du mail | `2025-11-10T10:00:00Z` |
| `type` | text | Type de mail | `"send"`, `"received"` |
| `category` | text | Catégorie d'action de l'agent | `"set_email"`, `"send_email"`, `"send_visio"`, `"set_remind"` |

## Format des pièces jointes

Le champ `attachment` doit contenir un JSON stringifié représentant un tableau d'objets :

```json
[
  {
    "name": "presentation.pdf",
    "size": 2048576,
    "url": "https://..."
  },
  {
    "name": "document.docx",
    "size": 512000,
    "url": "https://..."
  }
]
```

### Propriétés d'une pièce jointe

- `name` (string, obligatoire) : Nom du fichier
- `size` (number, optionnel) : Taille en octets
- `url` (string, optionnel) : URL de téléchargement

## Requêtes Supabase

### Récupérer les mails d'un utilisateur

```javascript
// Mails envoyés OU reçus par l'utilisateur
const { data, error } = await supabase
  .from('crm_mails')
  .select('*')
  .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
  .order('date', { ascending: false });
```

### Récupérer uniquement les mails envoyés

```javascript
const { data, error } = await supabase
  .from('crm_mails')
  .select('*')
  .eq('sender_id', userId)
  .order('date', { ascending: false });
```

### Récupérer uniquement les mails reçus

```javascript
const { data, error } = await supabase
  .from('crm_mails')
  .select('*')
  .eq('recipient_id', userId)
  .order('date', { ascending: false });
```

### Insérer un nouveau mail

```javascript
const { data, error } = await supabase
  .from('crm_mails')
  .insert([
    {
      sender: 'nparent@taskalys.fr',
      sender_id: 5,
      recipient: 'dupont@entreprise.fr',
      recipient_id: 12,
      object: 'Présentation Taskalys',
      html_body: '<div style="font-family: Arial;">...</div>',
      attachment: JSON.stringify([
        { name: 'presentation.pdf', size: 2048576 }
      ]),
      date: new Date().toISOString(),
      type: 'send',
      category: 'send_email' // set_email, send_email, send_visio, ou set_remind
    }
  ])
  .select();
```

## Catégories d'action

Le champ `category` permet de classifier les mails selon l'action de l'agent IA :

| Catégorie | Description | Icône | Couleur |
|-----------|-------------|-------|---------|
| `set_email` | Email planifié pour envoi ultérieur | 📅 calendar | Bleu (#2D5BFF) |
| `send_email` | Email envoyé immédiatement | ✉️ send | Bleu (#2D5BFF) |
| `send_visio` | Invitation Teams/visio envoyée | 📹 video | Violet Teams (#6264A7) |
| `set_remind` | Rappel programmé | 🔔 bell | Gris (#6b7280) |

## Real-time avec Supabase

Le CRM s'abonne automatiquement aux changements en temps réel sur la table `crm_mails`.

### Configuration du real-time

```javascript
const channel = supabase
  .channel('crm_mails_changes')
  .on(
    'postgres_changes',
    { 
      event: '*', 
      schema: 'public', 
      table: 'crm_mails',
      filter: `sender_id=eq.${userId}` // Mails envoyés
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .on(
    'postgres_changes',
    { 
      event: '*', 
      schema: 'public', 
      table: 'crm_mails',
      filter: `recipient_id=eq.${userId}` // Mails reçus
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .subscribe();
```

### Événements supportés

- `INSERT` : Nouveau mail ajouté
- `UPDATE` : Mail modifié
- `DELETE` : Mail supprimé

## Transformation des données

Le code JavaScript transforme automatiquement les données de la table en format d'affichage :

```javascript
{
  id: mail.id,
  direction: mail.type, // "send" ou "received"
  from: mail.sender || 'Expéditeur inconnu',
  to: mail.recipient || 'Destinataire inconnu',
  subject: mail.object || 'Sans objet',
  body: mail.html_body || '',
  date: mail.date || mail.created_at,
  attachments: JSON.parse(mail.attachment || '[]'),
  type: mail.type // "send" ou "received"
}
```

## Exemples de données

### Mail envoyé simple

```json
{
  "sender": "nparent@taskalys.fr",
  "sender_id": 5,
  "recipient": "dupont@entreprise.fr",
  "recipient_id": 12,
  "object": "Suite à notre échange téléphonique",
  "html_body": "<div style='font-family: Arial, sans-serif;'><p>Bonjour M. Dupont,</p><p>Suite à notre échange...</p></div>",
  "attachment": null,
  "date": "2025-11-10T14:30:00Z",
  "type": "send"
}
```

### Mail reçu avec pièce jointe

```json
{
  "sender": "martin@client.fr",
  "sender_id": 18,
  "recipient": "rdufeu@taskalys.fr",
  "recipient_id": 6,
  "object": "RE: Devis automatisation",
  "html_body": "<div><p>Bonjour,</p><p>Veuillez trouver ci-joint notre cahier des charges.</p></div>",
  "attachment": "[{\"name\":\"cahier_des_charges.pdf\",\"size\":1024000}]",
  "date": "2025-11-10T09:15:00Z",
  "type": "received"
}
```

### Mail avec plusieurs pièces jointes

```json
{
  "sender": "nparent@taskalys.fr",
  "sender_id": 5,
  "recipient": "contact@prospect.fr",
  "recipient_id": null,
  "object": "Présentation complète Taskalys",
  "html_body": "<div><p>Bonjour,</p><p>Vous trouverez en pièces jointes notre présentation et quelques cas clients.</p></div>",
  "attachment": "[{\"name\":\"presentation_taskalys.pdf\",\"size\":2048576},{\"name\":\"cas_client_1.pdf\",\"size\":512000},{\"name\":\"cas_client_2.pdf\",\"size\":768000}]",
  "date": "2025-11-09T16:45:00Z",
  "type": "send"
}
```

## Notes importantes

1. **type: send ou received** : 
   - Si `type === 'send'` → mail **envoyé**
   - Si `type === 'received'` → mail **reçu**
   - Si le champ `type` n'est pas défini ou invalide, on détermine automatiquement selon `sender_id === currentUserId`

2. **Gestion des pièces jointes** :
   - Toujours parser le JSON avec try/catch
   - Vérifier que c'est bien un tableau
   - Gérer le cas `null` ou chaîne vide

3. **HTML Body** :
   - Doit contenir du HTML valide
   - Les styles inline sont préservés
   - Le CSS est isolé dans le container `.mail-body-content`

4. **Real-time** :
   - Nécessite deux channels (sent + received)
   - Se déclenche automatiquement sur INSERT/UPDATE/DELETE
   - Met à jour l'interface sans rechargement
