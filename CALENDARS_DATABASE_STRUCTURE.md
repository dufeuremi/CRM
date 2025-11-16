# Structure de la table `crm_calendars`

## Schema Supabase

```sql
CREATE TABLE crm_calendars (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id SMALLINT,
  name TEXT,
  start TIMESTAMP WITH TIME ZONE,
  end TIMESTAMP WITH TIME ZONE,
  type TEXT,
  hours TEXT,
  linked_prospect_id BIGINT,
  validated BOOLEAN,
  details TEXT
);
```

## Description des colonnes

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| `id` | bigint | Identifiant unique de l'événement | `1` |
| `created_at` | timestamp | Date de création dans la base | `2025-11-10T14:30:00Z` |
| `user_id` | smallint | ID de l'utilisateur propriétaire | `5` |
| `name` | text | Nom/titre de l'événement | `"Rappeler M. Dupont"` |
| `start` | timestamp | Date et heure de début | `2025-11-12T10:00:00Z` |
| `end` | timestamp | Date et heure de fin | `2025-11-12T11:00:00Z` |
| `type` | text | Type d'événement | `"rappel"`, `"rdv"`, `"tache"`, `"autre"` |
| `hours` | text | Horaire formaté (ex: "10:00 - 11:00") | `"10:00 - 11:00"` |
| `linked_prospect_id` | bigint | ID du prospect lié (optionnel) | `123` |
| `validated` | boolean | Événement marqué comme fait | `false` |
| `details` | text | Détails supplémentaires de l'événement | `"Discuter du projet d'automatisation"` |

## Types d'événements

| Type | Description | Couleur | Badge |
|------|-------------|---------|-------|
| `rappel` | Rappel téléphonique ou email | Orange | 🔔 Rappel |
| `rdv` | Rendez-vous client | Bleu | 📅 RDV |
| `tache` | Tâche administrative | Vert | ✅ Tâche |
| `autre` | Autre type d'événement | Gris | 📌 Autre |

## Ajout de la colonne `details`

Pour ajouter la nouvelle colonne `details` à la table existante :

```sql
ALTER TABLE crm_calendars
ADD COLUMN details TEXT;
```

## Requêtes Supabase

### Récupérer les événements d'un utilisateur

```javascript
const { data, error } = await supabase
  .from('crm_calendars')
  .select('*')
  .eq('user_id', userId)
  .order('start', { ascending: true });
```

### Créer un nouvel événement avec détails

```javascript
const { data, error } = await supabase
  .from('crm_calendars')
  .insert([
    {
      user_id: 5,
      name: 'Rappeler M. Dupont',
      start: '2025-11-12T10:00:00Z',
      end: '2025-11-12T11:00:00Z',
      type: 'rappel',
      hours: '10:00 - 11:00',
      linked_prospect_id: 123,
      validated: false,
      details: 'Discuter du projet d\'automatisation et envoyer le devis'
    }
  ])
  .select();
```

### Mettre à jour les détails d'un événement

```javascript
const { error } = await supabase
  .from('crm_calendars')
  .update({ details: 'Nouveau détail important' })
  .eq('id', eventId);
```

## Interface CRM

L'interface CRM permet de :
- ✅ Cliquer sur un rappel pour voir les détails
- ✅ Afficher le champ `details` dans une modal ou un panneau déroulant
- ✅ Éditer les détails directement depuis l'interface
- ✅ Les détails sont optionnels (peuvent être NULL)

## Exemples d'utilisation

### Rappel simple sans détails
```json
{
  "name": "Rappeler client",
  "type": "rappel",
  "details": null
}
```

### Rappel avec détails complets
```json
{
  "name": "Rappeler M. Martin",
  "type": "rappel",
  "linked_prospect_id": 456,
  "details": "Sujet : Proposition commerciale\n- Envoyer le devis révisé\n- Confirmer la date du RDV de démo\n- Répondre aux questions techniques"
}
```

### RDV avec agenda détaillé
```json
{
  "name": "RDV découverte - Société ABC",
  "type": "rdv",
  "hours": "14:00 - 15:30",
  "linked_prospect_id": 789,
  "details": "Ordre du jour :\n1. Présentation Taskalys (15min)\n2. Analyse des besoins (30min)\n3. Démonstration outil (30min)\n4. Questions/réponses (15min)\n\nParticipants : DG + DSI"
}
```
