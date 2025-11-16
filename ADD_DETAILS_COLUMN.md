# Ajout de la colonne `details` à la table `crm_calendars`

## Commande SQL à exécuter dans Supabase

Pour ajouter la nouvelle colonne `details` à la table existante `crm_calendars`, exécutez cette commande SQL dans l'éditeur SQL de Supabase :

```sql
ALTER TABLE crm_calendars
ADD COLUMN details TEXT;
```

## Vérification

Après avoir exécuté la commande, vérifiez que la colonne a bien été ajoutée :

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'crm_calendars'
ORDER BY ordinal_position;
```

Vous devriez voir la colonne `details` avec le type `text` et `is_nullable = YES`.

## Test d'insertion

Testez l'ajout d'un événement avec des détails :

```sql
INSERT INTO crm_calendars (user_id, name, start, "end", type, hours, validated, details)
VALUES (
  1, 
  'Rappeler M. Dupont',
  '2025-11-12 10:00:00',
  '2025-11-12 11:00:00',
  'rappel',
  '10:00 - 11:00',
  false,
  'Discuter du projet d''automatisation
- Envoyer le devis révisé
- Confirmer la date du RDV de démo'
);
```

## Fonctionnalités dans le CRM

Une fois la colonne ajoutée, les utilisateurs pourront :

✅ **Cliquer sur un rappel** pour voir ses détails dans une modal
✅ **Afficher tous les détails** : nom, type, date, horaire, prospect lié, et détails complets
✅ **Voir les détails formatés** avec conservation des retours à la ligne
✅ **Modal élégante** avec design cohérent et animations

## Structure de la modal

La modal affiche :
- **En-tête** : Type d'événement (badge coloré) + statut validé
- **Titre** : Nom de l'événement
- **Date et heure** : Formatées en français
- **Prospect lié** : Si l'événement est lié à un prospect (nom + entreprise)
- **Détails** : Texte complet avec formatage préservé
- **Actions** : Bouton de fermeture

## Exemples d'utilisation

### Détails simples
```
Appeler pour confirmer le RDV
```

### Détails structurés
```
Ordre du jour :
1. Présentation Taskalys (15min)
2. Analyse des besoins (30min)
3. Démonstration outil (30min)
4. Questions/réponses (15min)

Participants : DG + DSI
```

### Checklist
```
Avant l'appel :
- ✓ Préparer le devis
- ✓ Relire les notes du dernier échange
- ○ Vérifier les disponibilités pour le RDV

Points à aborder :
• Budget alloué au projet
• Timeline souhaitée
• Décisionnaires impliqués
```

## Politique RLS (Row Level Security)

La colonne `details` hérite automatiquement des politiques RLS existantes sur la table `crm_calendars`. Aucune modification n'est nécessaire.
