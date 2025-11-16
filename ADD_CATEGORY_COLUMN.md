# Ajout de la colonne `category` à la table `crm_mails`

## Commande SQL à exécuter dans Supabase

Pour ajouter la nouvelle colonne `category` à la table existante `crm_mails`, exécutez cette commande SQL dans l'éditeur SQL de Supabase :

```sql
ALTER TABLE crm_mails
ADD COLUMN category TEXT;
```

## Description de la colonne

La colonne `category` permet de classifier les mails selon l'action de l'agent IA qui a déclenché l'envoi.

### Valeurs possibles

| Valeur | Description | Badge couleur | Icône |
|--------|-------------|---------------|-------|
| `set_email` | Email planifié pour envoi ultérieur | Bleu (#2D5BFF) | 📅 calendar |
| `send_email` | Email envoyé immédiatement | Bleu (#2D5BFF) | ✉️ send |
| `send_visio` | Invitation Teams/visio envoyée | Violet (#6264A7) | 📹 video |
| `set_remind` | Rappel programmé | Gris (#6b7280) | 🔔 bell |
| `null` | Mail reçu ou sans catégorie | - | - |

## Vérification

Après avoir exécuté la commande, vérifiez que la colonne a bien été ajoutée :

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'crm_mails'
ORDER BY ordinal_position;
```

Vous devriez voir la colonne `category` avec le type `text` et `is_nullable = YES`.

## Migration des données existantes (optionnel)

Si vous avez déjà des données dans la table et souhaitez les migrer, vous pouvez exécuter des requêtes UPDATE basées sur certains critères :

```sql
-- Exemple : Marquer tous les mails envoyés avec pièce jointe comme send_email
UPDATE crm_mails
SET category = 'send_email'
WHERE type = 'send' 
  AND attachment IS NOT NULL 
  AND category IS NULL;

-- Exemple : Marquer les invitations visio (si l'objet contient "Teams" ou "Visio")
UPDATE crm_mails
SET category = 'send_visio'
WHERE type = 'send' 
  AND (object ILIKE '%teams%' OR object ILIKE '%visio%' OR object ILIKE '%rdv%')
  AND category IS NULL;
```

## Politique RLS (Row Level Security)

La colonne `category` hérite automatiquement des politiques RLS existantes sur la table `crm_mails`. Aucune modification n'est nécessaire.

## Interface CRM

L'interface CRM a été mise à jour pour :
- ✅ Afficher un badge de catégorie coloré à droite de chaque mail
- ✅ Utiliser les bonnes couleurs selon le type d'action (bleu/violet/gris)
- ✅ Afficher l'icône appropriée (calendar/send/video/bell)
- ✅ Gérer les mails sans catégorie (null) de manière transparente

Les badges de catégorie n'apparaissent que pour les mails qui ont une catégorie définie.
