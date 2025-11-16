# Implémentation de la section Mails avec Supabase

## ✅ Modifications effectuées

### 1. Mise à jour de `script.js`

#### Fonction `loadMails()` modifiée
- **Avant** : Requête avec `.eq('user_id', currentUserId)`
- **Après** : Requête avec `.or()` pour récupérer les mails envoyés ET reçus
  ```javascript
  .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
  ```

#### Transformation des données
Les données de la table `crm_mails` sont transformées pour correspondre au format d'affichage :

```javascript
{
  id: mail.id,
  direction: mail.sender_id === currentUserId ? 'sent' : 'received',
  from: mail.sender,
  to: mail.recipient,
  subject: mail.object,
  body: mail.html_body,
  date: mail.date || mail.created_at,
  attachments: JSON.parse(mail.attachment || '[]'),
  type: mail.type
}
```

#### Fonctions real-time ajoutées

**`setupMailsRealtime()`**
- Crée un channel Supabase avec deux filtres :
  - `sender_id=eq.{userId}` pour les mails envoyés
  - `recipient_id=eq.{userId}` pour les mails reçus
- S'abonne aux événements INSERT, UPDATE, DELETE

**`handleMailChange(payload)`**
- Traite les événements real-time
- Met à jour `allMails` en conséquence
- Applique automatiquement les filtres actifs

**`applyCurrentMailFilter()`**
- Réapplique les filtres actifs (Tous/Envoyés/Reçus)
- Applique la recherche si présente
- Rafraîchit l'affichage

### 2. Structure de la table `crm_mails`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | Identifiant unique |
| `created_at` | timestamp | Date de création |
| `sender` | text | Email expéditeur |
| `sender_id` | smallint | ID utilisateur expéditeur |
| `recipient` | text | Email destinataire |
| `recipient_id` | smallint | ID utilisateur destinataire |
| `object` | text | Objet du mail |
| `html_body` | text | Corps HTML |
| `attachment` | text | JSON des pièces jointes |
| `date` | timestamp | Date d'envoi/réception |
| `type` | text | Type (email, reply, forward) |

### 3. Gestion des pièces jointes

Le champ `attachment` contient un JSON stringifié :
```json
[
  {
    "name": "document.pdf",
    "size": 1024000,
    "url": "https://..."
  }
]
```

Le code parse automatiquement ce JSON avec gestion d'erreur.

### 4. Real-time Supabase

#### Configuration
```javascript
const channel = supabase
  .channel('crm_mails_changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'crm_mails',
    filter: `sender_id=eq.${userId}`
  }, handleChange)
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'crm_mails',
    filter: `recipient_id=eq.${userId}`
  }, handleChange)
  .subscribe();
```

#### Événements gérés
- **INSERT** : Ajoute le nouveau mail au début de la liste
- **UPDATE** : Met à jour le mail existant
- **DELETE** : Supprime le mail de la liste

## 📁 Fichiers créés

### 1. `MAILS_DATABASE_STRUCTURE.md`
Documentation complète de la structure de la table `crm_mails` :
- Schéma SQL
- Description des colonnes
- Format des pièces jointes
- Exemples de requêtes Supabase
- Configuration real-time
- Exemples de données

### 2. `test_mails.js`
Script de test pour insérer des mails d'exemple dans la base :
- `insertTestMails()` : Insère 5 mails variés (envoyés/reçus, avec/sans PJ)
- `deleteAllTestMails()` : Supprime tous les mails de l'utilisateur
- À exécuter dans la console du navigateur

### 3. `prompt_agent_improved.md`
Prompt engineering amélioré pour l'agent IA (travail précédent)

## 🚀 Comment utiliser

### 1. Insérer des mails de test

1. Ouvrir `dashboard.html` dans le navigateur
2. Se connecter au CRM
3. Ouvrir la console (F12)
4. Charger le script de test :
   ```javascript
   // Copier-coller le contenu de test_mails.js dans la console
   ```
5. Exécuter :
   ```javascript
   insertTestMails()
   ```

### 2. Vérifier le real-time

1. Ouvrir deux onglets avec `dashboard.html`
2. Se connecter avec le même compte
3. Aller dans la section "Mails" sur les deux onglets
4. Dans la console d'un onglet, insérer un mail :
   ```javascript
   await window.supabaseClient
     .from('crm_mails')
     .insert([{
       sender: 'test@example.com',
       sender_id: null,
       recipient: 'nparent@taskalys.fr',
       recipient_id: window.currentUserId,
       object: 'Test real-time',
       html_body: '<p>Ceci est un test</p>',
       date: new Date().toISOString(),
       type: 'email'
     }])
   ```
5. Le nouveau mail devrait apparaître automatiquement dans l'autre onglet

### 3. Tester les filtres

- Cliquer sur "Tous", "Envoyés", "Reçus" pour filtrer
- Utiliser la barre de recherche pour chercher par objet/corps/email
- Cliquer sur une carte pour l'agrandir et voir le corps complet

## 🔍 Points d'attention

### Direction des mails
La direction est déterminée par :
```javascript
direction = mail.sender_id === currentUserId ? 'sent' : 'received'
```

### Parsing des pièces jointes
Le code gère plusieurs formats :
- `null` ou `undefined` → `[]`
- String JSON → parse avec try/catch
- Objet simple → converti en tableau
- Tableau → utilisé tel quel

### Performance
- Les requêtes utilisent `.or()` au lieu de deux requêtes séparées
- Le real-time utilise deux filtres pour capturer les deux directions
- Les mails sont triés par date décroissante (plus récent en haut)

## 🐛 Debugging

### Vérifier la connexion Supabase
```javascript
console.log('Supabase:', window.supabaseClient);
console.log('User ID:', window.currentUserId);
```

### Vérifier les mails chargés
```javascript
console.log('All mails:', allMails);
console.log('Filtered mails:', filteredMails);
```

### Vérifier le real-time
```javascript
// Les changements apparaissent dans la console :
// "Mail change received (sent):" ou "Mail change received (received):"
```

### Tester une requête manuelle
```javascript
const { data, error } = await window.supabaseClient
  .from('crm_mails')
  .select('*')
  .or(`sender_id.eq.${window.currentUserId},recipient_id.eq.${window.currentUserId}`);
  
console.log('Data:', data);
console.log('Error:', error);
```

## 📊 Statistiques de l'implémentation

- **Lignes de code ajoutées** : ~260 lignes
- **Fonctions créées** : 3 (setupMailsRealtime, handleMailChange, applyCurrentMailFilter)
- **Fonction modifiée** : 1 (loadMails)
- **Fichiers de documentation** : 3
- **Temps de développement** : Immédiat avec real-time
- **Compatibilité** : 100% avec la structure existante

## ✨ Fonctionnalités

### Affichage
- ✅ Liste des mails envoyés et reçus
- ✅ Badge de direction (vert pour envoyés, bleu pour reçus)
- ✅ Date formatée en français
- ✅ Aperçu du contenu (150 caractères)
- ✅ Badge de pièces jointes avec compteur
- ✅ Cartes cliquables pour agrandir

### Filtres
- ✅ Tous les mails
- ✅ Uniquement envoyés
- ✅ Uniquement reçus
- ✅ Recherche par objet/corps/email

### Real-time
- ✅ Nouveau mail → ajout automatique
- ✅ Mail modifié → mise à jour automatique
- ✅ Mail supprimé → retrait automatique
- ✅ Préservation des filtres actifs
- ✅ Préservation de la recherche

### Détails
- ✅ Corps HTML complet avec CSS préservé
- ✅ Liste des pièces jointes avec taille formatée
- ✅ Icônes Lucide pour tous les éléments
- ✅ Animation smooth lors de l'expansion
- ✅ Scrollbar personnalisée

## 🎯 Prochaines étapes possibles

1. **Téléchargement de pièces jointes** : Ajouter des liens de téléchargement
2. **Réponse rapide** : Bouton pour répondre directement
3. **Recherche avancée** : Filtrer par date, type, taille de PJ
4. **Pagination** : Charger les mails par lots de 50
5. **Statistiques** : Nombre de mails envoyés/reçus par mois
6. **Export** : Exporter la liste des mails en CSV/PDF
7. **Tri** : Trier par date, expéditeur, objet
8. **Labels** : Ajouter des étiquettes (Important, Suivi, etc.)
