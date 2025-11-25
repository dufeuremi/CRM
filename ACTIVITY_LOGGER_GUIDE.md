# Guide du Système de Logging d'Activité - Activity Logger

## Vue d'ensemble

Le système `ActivityLogger` enregistre automatiquement les activités utilisateur dans la table Supabase `crm_logs`. Il inclut un **système de rate limiting** pour limiter à **1 log par minute par utilisateur** et éviter de surcharger la base de données.

## Architecture

### Fichiers impliqués
- **`logActivity.js`** - Système de logging centralisé
- **`login.html`** - Logs les connexions utilisateur
- **`dashboard.html`** - Initialise le logger et log les logins
- **`script.js`** - Log les déconnexions et appels API critiques

### Table Supabase
```
crm_logs
├── id (bigint, clé primaire)
├── created_at (timestamp with time zone)
├── user_id (smallint, référence utilisateur)
└── activity_type (string) - type d'activité
└── details (jsonb) - détails additionnels
```

---

## Caractéristiques

### 1. Rate Limiting
- **1 log par minute par utilisateur** maximum
- Empêche la surcharge de la base de données
- Suivi automatique du dernier log pour chaque utilisateur

### 2. Types d'Activités Supportées

| Type | Description | Exemple |
|------|-------------|---------|
| `login` | Connexion utilisateur | `{email: "user@example.com"}` |
| `logout` | Déconnexion utilisateur | `{action: "user_logout"}` |
| `api_call` | Appel API vers Supabase | `{endpoint: "/prospects", method: "GET"}` |
| `export` | Export de données | `{export_type: "prospects", record_count: 150}` |
| `supabase_query` | Requête Supabase (échantillonnage) | `{table: "crm_prospects", operation: "SELECT"}` |
| `custom` | Activité personnalisée | Définissable librement |

### 3. Sécurité
- Enregistrement du **User-Agent** du navigateur
- Capture de **l'adresse IP** (best-effort)
- Timestamp automatique en UTC

---

## Utilisation

### Initialisation en HTML

```html
<!-- Charger le script logActivity.js -->
<script src="logActivity.js"></script>
```

### Configuration dans le code

```javascript
// Dans dashboard.html ou après création du client Supabase
activityLogger.setSupabaseClient(supabaseClient);
```

### Exemples d'utilisation

#### 1. Logger une connexion (automatique dans login.html)
```javascript
const userId = 42;
const email = "user@example.com";
await activityLogger.logLogin(userId, email);
```

#### 2. Logger une déconnexion (automatique dans script.js)
```javascript
await activityLogger.logLogout(userId);
```

#### 3. Logger une API call
```javascript
await activityLogger.logApiCall(
    userId,
    '/crm_prospects',
    'GET',
    200
);
```

#### 4. Logger une export
```javascript
await activityLogger.logExport(
    userId,
    'prospects_xlsx',
    250  // nombre d'enregistrements
);
```

#### 5. Logger une activité personnalisée
```javascript
await activityLogger.logActivity(
    userId,
    'custom_action',
    {
        action_name: 'bulk_email_send',
        recipient_count: 50,
        campaign_id: 'camp_123'
    }
);
```

#### 6. Logger une requête Supabase (avec sampling)
```javascript
// Logs 1 sur 10 requêtes pour éviter surcharge
await activityLogger.logSupabaseQuery(
    userId,
    'crm_prospects',
    'SELECT'
);
```

---

## Rate Limiting Détails

### Mécanisme
- **Interval par défaut** : 60 000 ms (1 minute)
- **Vérification** : `canLog(userId)` avant chaque log
- **Mise à jour** : `updateLastLogTime(userId)` après log réussi

### Récupérer le cooldown restant
```javascript
const remainingMs = activityLogger.getRemainingCooldown(userId);
console.log(`Prochain log possible dans: ${remainingMs}ms`);
```

### Dépasser le rate limit
```javascript
if (!activityLogger.canLog(userId)) {
    console.log('Déjà loggé. En attente du cooldown...');
    // Le logger retourne `false` automatiquement
}
```

---

## Requêtes de Données

### Obtenir les logs d'un utilisateur
```javascript
const logs = await activityLogger.getActivityLogs(
    userId,
    100  // limite (défaut: 100)
);

logs.forEach(log => {
    console.log(`${log.created_at}: ${log.activity_type}`);
});
```

### Obtenir tous les logs (admin)
```javascript
const allLogs = await activityLogger.getAllActivityLogs(1000);
```

### Statistiques des requêtes
```javascript
const stats = activityLogger.getQueryStats(userId);
console.log(`Total queries: ${stats.total_queries}`);
```

### Nettoyer les anciens logs
```javascript
// Supprimer les logs > 30 jours
await activityLogger.clearOldLogs(30);
```

### Réinitialiser les statistiques
```javascript
activityLogger.resetQueryStats();
```

---

## Implémentation Actuelle

### 1. **Login.html** - Logging de connexion

Lors d'une connexion réussie :
```javascript
try {
    const { data: profileData } = await supabase
        .from('crm_users')
        .select('id')
        .eq('auth_id', userId)
        .single();
    
    if (profileData) {
        await activityLogger.logLogin(profileData.id, userEmail);
    }
} catch (logError) {
    console.warn('Could not log login activity:', logError);
}
```

### 2. **Dashboard.html** - Initialisation et logging

```javascript
// Initialiser le logger
activityLogger.setSupabaseClient(supabase);

// Dans loadUserInfo, après récupération des données utilisateur
if (typeof activityLogger !== 'undefined') {
    activityLogger.logLogin(userData.id, userData.email)
        .catch(err => console.warn('Could not log login:', err));
}
```

### 3. **Script.js** - Logging de déconnexion

```javascript
if (typeof activityLogger !== 'undefined' && window.currentUserId) {
    await activityLogger.logLogout(window.currentUserId)
        .catch(err => console.warn('Could not log logout:', err));
}
```

---

## Bonnes Pratiques

### ✅ À Faire

1. **Toujours vérifier l'existence du logger** :
   ```javascript
   if (typeof activityLogger !== 'undefined') {
       await activityLogger.logActivity(...);
   }
   ```

2. **Utiliser les méthodes de shortcut** :
   ```javascript
   // ✅ Bon
   await activityLogger.logLogin(userId, email);
   
   // Au lieu de
   await activityLogger.logActivity(userId, 'login', {...});
   ```

3. **Attendre le cooldown** :
   ```javascript
   if (activityLogger.canLog(userId)) {
       await activityLogger.logActivity(...);
   }
   ```

4. **Gérer les erreurs gracieusement** :
   ```javascript
   await activityLogger.logActivity(...)
       .catch(err => console.warn('Logging failed:', err));
   ```

### ❌ À Éviter

1. **Logger à chaque requête** :
   ```javascript
   // ❌ Mauvais - surcharge DB
   await fetch(...);
   activityLogger.logApiCall(...); // Trop fréquent
   ```

2. **Attendre le logging** :
   ```javascript
   // ❌ Mauvais - bloque l'UI
   await activityLogger.logActivity(...);
   
   // ✅ Bon - fire and forget
   activityLogger.logActivity(...).catch(console.warn);
   ```

3. **Oublier vérification typeof** :
   ```javascript
   // ❌ Mauvais - crash si pas chargé
   activityLogger.logActivity(...);
   ```

---

## Exemples Complets

### Scenario 1 : Page de Dashboard chargée

```javascript
// Dans dashboard.html lors du chargement
document.addEventListener('DOMContentLoaded', async () => {
    // Logger chargé et initialisé
    const userId = window.currentUserId; // 42
    
    // Log
    await activityLogger.logActivity(userId, 'dashboard_loaded', {
        page: 'dashboard',
        timestamp: new Date().toISOString()
    });
    
    // Récupérer historique
    const recentLogs = await activityLogger.getActivityLogs(userId, 10);
    console.log('Derniers logs:', recentLogs);
});
```

### Scenario 2 : Export de prospects

```javascript
async function exportProspects() {
    const prospects = await fetchProspectsFromDB();
    
    // Logger l'export
    if (typeof activityLogger !== 'undefined') {
        activityLogger.logExport(
            window.currentUserId,
            'prospects_csv',
            prospects.length
        ).catch(console.warn);
    }
    
    // Continuer avec l'export
    generateCSV(prospects);
}
```

### Scenario 3 : Appel API personnalisé

```javascript
async function callCustomAPI(endpoint) {
    try {
        const response = await fetch(endpoint);
        
        // Logger l'appel (ne bloque pas)
        if (typeof activityLogger !== 'undefined') {
            activityLogger.logApiCall(
                window.currentUserId,
                endpoint,
                'POST',
                response.status
            ).catch(console.warn);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
```

---

## Dépannage

### Le logging ne fonctionne pas

1. **Vérifier que le script est chargé** :
   ```javascript
   console.log(typeof activityLogger); // Doit être 'object'
   ```

2. **Vérifier que Supabase est initialisé** :
   ```javascript
   console.log(activityLogger.supabaseClient); // Doit exister
   ```

3. **Vérifier les erreurs console** :
   ```javascript
   // Activer les logs de debug
   activityLogger.logActivity(userId, 'test', {})
       .then(result => console.log('Success:', result))
       .catch(err => console.error('Error:', err));
   ```

### Le rate limiting bloque mon log

```javascript
// Vérifier le cooldown
const cooldown = activityLogger.getRemainingCooldown(userId);
if (cooldown > 0) {
    console.log(`Attendre ${cooldown}ms`);
}
```

### Les logs ne s'affichent pas dans Supabase

1. Vérifier que les permissions RLS sont correctes
2. Vérifier que `user_id` est un `smallint` valide
3. Vérifier les erreurs Supabase dans console :
   ```javascript
   activityLogger.logActivity(userId, 'test', {})
       .catch(err => console.error('Supabase error:', err.message));
   ```

---

## Performance

### Impact sur les performances

- **Minimal** - Logging asynchrone sans blocage
- **Rate limited** - Maximum 1 insert/minute par utilisateur
- **Sampling** - Les requêtes Supabase sont échantillonnées (1/10)

### Optimisations intégrées

1. **Fire-and-forget** - Pas d'attente
2. **Cooldown** - Évite les doublons
3. **Sampling** - Réduit la charge DB
4. **Cleanup** - `clearOldLogs()` disponible

---

## Données Enregistrées

### Structure complète d'un log

```json
{
    "id": 42,
    "created_at": "2025-11-19T14:23:45.123Z",
    "user_id": 7,
    "activity_type": "login",
    "details": {
        "email": "user@example.com",
        "action": "user_login",
        "timestamp": "2025-11-19T14:23:45.123Z"
    },
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

---

## Support

Pour toute question ou problème, consultez :
- Les logs console (F12 > Console)
- Les erreurs Supabase Dashboard
- Le fichier logActivity.js pour les méthodes disponibles
