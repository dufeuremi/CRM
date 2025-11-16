# Ajout de la colonne AI dans crm_calendars

## Description
Ajout d'une colonne `ai` (boolean) dans la table `crm_calendars` pour identifier les rappels créés automatiquement par l'intelligence artificielle.

## Migration SQL

```sql
-- Ajouter la colonne ai avec valeur par défaut false
ALTER TABLE crm_calendars 
ADD COLUMN ai BOOLEAN DEFAULT false;

-- Optionnel: Créer un index si vous filtrez souvent par cette colonne
CREATE INDEX idx_crm_calendars_ai ON crm_calendars(ai);
```

## Utilisation

### Structure de la table mise à jour
```sql
CREATE TABLE crm_calendars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    prospect_id UUID REFERENCES crm_prospects(id),
    title TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    type TEXT,
    details TEXT,
    ai BOOLEAN DEFAULT false,  -- NOUVEAU: Indique si créé par IA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Exemples d'utilisation

#### Créer un rappel généré par l'IA
```javascript
const { data, error } = await supabase
    .from('crm_calendars')
    .insert({
        user_id: userId,
        prospect_id: prospectId,
        title: 'Rappel de suivi',
        start_time: reminderDate,
        type: 'rappel',
        ai: true  // Marquer comme créé par l'IA
    });
```

#### Filtrer les rappels créés par l'IA
```javascript
const { data, error } = await supabase
    .from('crm_calendars')
    .select('*')
    .eq('ai', true);
```

#### Afficher un badge pour les rappels IA
```javascript
if (calendar.ai) {
    // Afficher une étiquette "AI" sur l'événement
    badge = '<span class="ai-badge">AI</span>';
}
```

## Impact

- **Frontend**: Affichage d'un badge "AI" sur les rappels générés automatiquement
- **Backend**: Traçabilité des événements créés par l'IA vs manuellement
- **Analytics**: Possibilité de mesurer l'efficacité des rappels IA vs manuels

## Notes

- Les rappels existants auront `ai = false` par défaut
- Seuls les nouveaux rappels créés par l'agent IA auront `ai = true`
- Cette colonne est utile pour l'audit et les statistiques
