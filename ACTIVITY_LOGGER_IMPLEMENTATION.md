# Implémentation du Système de Logging d'Activité - Summary

## 📋 Résumé de l'Implémentation

Un système complet de logging des activités utilisateur a été intégré au CRM Taskalys. Ce système enregistre automatiquement les connexions, déconnexions, et appels API dans la table Supabase `crm_logs` avec un **rate limiting de 1 log par minute par utilisateur**.

---

## 🎯 Fichiers Créés / Modifiés

### ✅ Fichiers Créés

| Fichier | Description |
|---------|-------------|
| **`logActivity.js`** | Système de logging centralisé avec rate limiting |
| **`ACTIVITY_LOGGER_GUIDE.md`** | Documentation complète du système |
| **`test-activity-logger.html`** | Suite de tests interactive |

### ✅ Fichiers Modifiés

| Fichier | Modifications |
|---------|--------------|
| **`login.html`** | Ajout du script `logActivity.js` + logging de connexion |
| **`dashboard.html`** | Initialisation du logger + logging de login/dashboard |
| **`script.js`** | Logging de déconnexion |

---

## 🔧 Architecture Technique

### Classes principales

#### `ActivityLogger` (dans `logActivity.js`)

```javascript
class ActivityLogger {
    // Rate limiting par utilisateur
    lastLogTime = {};
    LOG_INTERVAL_MS = 60000; // 1 minute
    
    // Méthodes principales
    logLogin(userId, email)
    logLogout(userId)
    logApiCall(userId, endpoint, method, statusCode)
    logExport(userId, exportType, recordCount)
    logActivity(userId, activityType, details)
    logSupabaseQuery(userId, table, operation)
    
    // Récupération des données
    getActivityLogs(userId, limit)
    getAllActivityLogs(limit)
    
    // Utilitaires
    canLog(userId)
    getRemainingCooldown(userId)
    clearOldLogs(daysOld)
}
```

### Structure de la table Supabase

```sql
crm_logs (
    id: bigint PRIMARY KEY,
    created_at: timestamp with time zone,
    user_id: smallint (référence utilisateur),
    activity_type: string (login, logout, api_call, export, supabase_query, custom),
    details: jsonb (champs additionnels),
    ip_address: string,
    user_agent: string,
    timestamp: string
)
```

---

## 🚀 Fonctionnement

### 1️⃣ Flux de Connexion

```
User clique "Se connecter" (login.html)
    ↓
Supabase authentifie l'utilisateur
    ↓
Si succès → Récupère user_id de la table crm_users
    ↓
Appelle: activityLogger.logLogin(userId, email)
    ↓
Vérification du rate limit (1 log/min par user)
    ↓
Si OK → Insère log dans crm_logs
    ↓
Redirige vers dashboard.html
```

### 2️⃣ Flux de Déconnexion

```
User clique "Déconnexion" (script.js)
    ↓
Appelle: activityLogger.logLogout(userId)
    ↓
Vérification du rate limit
    ↓
Si OK → Insère log dans crm_logs
    ↓
Appelle: supabaseClient.auth.signOut()
    ↓
Redirige vers login.html?logout=true
```

### 3️⃣ Rate Limiting

```
Premier log à 14:30:00
    → lastLogTime[userId] = 14:30:00
    → Prochain log autorisé à 14:31:00

Log tenté à 14:30:30
    → canLog() = false (30s < 60s)
    → Fonction retourne false
    → Pas d'insertion en DB

Log tenté à 14:31:05
    → canLog() = true (65s > 60s)
    → Insertion OK
    → lastLogTime[userId] = 14:31:05
```

---

## 📊 Fonctionnalités Implémentées

### ✅ Logging des Activités

- **✅ Connexion (login)** - Enregistré au succès de l'authentification
- **✅ Déconnexion (logout)** - Enregistré lors du clic sur "Déconnexion"
- **✅ Appels API** - Disponible pour logging manuel
- **✅ Exports** - Disponible pour logging manuel
- **✅ Requêtes Supabase** - Sampling (1/10) pour éviter surcharge
- **✅ Activités personnalisées** - Extensible via `logActivity()`

### ✅ Rate Limiting

- **1 log par minute par utilisateur** maximum
- **Vérification avant insertion** en DB
- **Tracking automatique** du cooldown
- **Méthode `getRemainingCooldown()`** pour connaître délai restant

### ✅ Sécurité

- **Capture de l'IP** (best-effort)
- **Capture du User-Agent** automatique
- **Timestamp UTC** en ISO 8601
- **user_id** validé à chaque log
- **Erreurs gracieuses** si client Supabase non disponible

### ✅ Gestion des Données

- **Lecture des logs** par utilisateur ou globalement
- **Statistiques des requêtes** par utilisateur
- **Nettoyage automatique** des anciens logs (>30j)
- **Export optionnel** en JSON

### ✅ Performance

- **Fire-and-forget** - Pas d'attente bloquante
- **Asynchrone** - N'impacte pas le UX
- **Sampling des requêtes** - Réduit la charge DB
- **Cooldown** - Prévient les doublons

---

## 📝 Exemples d'Utilisation

### Dans login.html (connexion)

```javascript
// Après succès d'authentification
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

### Dans dashboard.html (initialisation)

```javascript
// Initialisation du logger
if (typeof activityLogger !== 'undefined') {
    activityLogger.setSupabaseClient(supabase);
}

// Dans loadUserInfo, après récupération utilisateur
if (typeof activityLogger !== 'undefined') {
    activityLogger.logLogin(userData.id, userData.email)
        .catch(err => console.warn('Could not log login:', err));
}
```

### Dans script.js (déconnexion)

```javascript
logoutBtn.addEventListener('click', async () => {
    // Log la déconnexion
    if (typeof activityLogger !== 'undefined' && window.currentUserId) {
        await activityLogger.logLogout(window.currentUserId)
            .catch(err => console.warn('Could not log logout:', err));
    }
    
    // Déconnexion Supabase
    const { error } = await window.supabaseClient.auth.signOut();
    
    // Redirection
    window.location.href = 'login.html?logout=true';
});
```

---

## 🧪 Tests

### Suite de Tests Interactive

Un fichier **`test-activity-logger.html`** est disponible pour tester le système :

```
Ouvrir: test-activity-logger.html
├── Configuration
│   ├── Supabase URL
│   ├── Supabase Key
│   └── User ID
├── Tests d'Activités
│   ├── Login
│   ├── Logout
│   ├── API Call
│   ├── Export
│   ├── Custom
│   └── Query
├── Tests de Rate Limiting
│   ├── Logs Rapides
│   ├── Cooldown
│   └── Reset
├── Récupération de Données
│   ├── Logs Utilisateur
│   ├── Tous les Logs
│   ├── Statistiques
│   └── Nettoyage
└── Sortie Console
```

### Accès au Test

```
URL: file:///.../CRM/test-activity-logger.html
ou
http://localhost:3000/test-activity-logger.html
```

---

## 📈 Métriques et Monitoring

### Vérifier les Logs dans Supabase

```sql
-- Tous les logs du jour
SELECT * FROM crm_logs 
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Logs par utilisateur
SELECT * FROM crm_logs 
WHERE user_id = 7
ORDER BY created_at DESC
LIMIT 100;

-- Activités par type
SELECT activity_type, COUNT(*) as count
FROM crm_logs
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY activity_type;

-- Utilisateurs actifs aujourd'hui
SELECT DISTINCT user_id, COUNT(*) as activities
FROM crm_logs
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id
ORDER BY activities DESC;
```

### Via JavaScript

```javascript
// Logs de l'utilisateur 7
const logs = await activityLogger.getActivityLogs(7, 100);
console.table(logs);

// Tous les logs
const allLogs = await activityLogger.getAllActivityLogs(1000);
console.log(`Total logs: ${allLogs.length}`);

// Statistiques
const stats = activityLogger.getQueryStats(7);
console.log(`Requêtes pour user 7: ${stats.total_queries}`);
```

---

## 🔐 Sécurité et Permissions

### Row-Level Security (RLS)

Vérifier les politiques RLS sur la table `crm_logs` :

```sql
-- Politique pour lire ses propres logs
CREATE POLICY "Users can view their own logs"
ON crm_logs FOR SELECT
USING (user_id = auth.uid());

-- Politique pour que le système ajoute des logs
CREATE POLICY "System can insert logs"
ON crm_logs FOR INSERT
WITH CHECK (true);
```

### Accès Admin

Pour voir tous les logs (admin seulement) :

```javascript
// Modifier RLS ou utiliser un rôle admin
const allLogs = await activityLogger.getAllActivityLogs();
```

---

## 🚨 Gestion des Erreurs

### Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Supabase client not initialized` | Logger pas initialisé | Appeler `setSupabaseClient()` |
| `userId is required` | User ID manquant | Passer un `user_id` valide |
| `Rate limited` | 1 log/min atteint | Attendre ou utiliser `getRemainingCooldown()` |
| `Error inserting log` | Erreur DB | Vérifier les permissions RLS |

### Debugging

```javascript
// Vérifier l'état du logger
console.log(typeof activityLogger); // 'object'
console.log(activityLogger.supabaseClient); // Doit exister

// Vérifier le rate limit
console.log(activityLogger.lastLogTime); // Voir timestamps

// Tester l'insertion directe
const { data, error } = await supabase
    .from('crm_logs')
    .insert([{ user_id: 1, activity_type: 'test', details: {} }]);
console.log({ data, error });
```

---

## 📅 Maintenance

### Tâches Récurrentes

- **Quotidienne** : Aucune (automatique)
- **Hebdomadaire** : Vérifier les logs anormaux
- **Mensuelle** : Nettoyer les logs > 30 jours
- **Trimestrielle** : Analyser les patterns d'activité

### Nettoyage Automatique

```javascript
// Lancer chaque mois
await activityLogger.clearOldLogs(30);
```

### Réinitialisation des Statistiques

```javascript
// Lancer chaque jour (minuit)
activityLogger.resetQueryStats();
```

---

## 📚 Documentation Complète

Pour plus de détails, consulter : **`ACTIVITY_LOGGER_GUIDE.md`**

---

## ✅ Checklist d'Intégration

- ✅ `logActivity.js` créé et chargé dans `login.html`
- ✅ `logActivity.js` chargé dans `dashboard.html`
- ✅ Logger initialisé dans `dashboard.html`
- ✅ Login loggé automatiquement
- ✅ Logout loggé automatiquement
- ✅ Rate limiting implémenté (1/min/user)
- ✅ Suite de tests créée
- ✅ Documentation complète fournie

---

## 🎓 Prochaines Étapes

### Optionnel - Améliorations Futures

1. **Dashboard d'Analytics** - Afficher les logs en temps réel
2. **Alertes** - Notifier sur activités suspectes
3. **Export** - Exporter les logs en CSV/PDF
4. **Webhooks** - Déclencher des actions sur certain logs
5. **API** - Exposer les logs via une API REST
6. **Archivage** - Archiver les anciens logs ailleurs

### À Surveiller

- Performance avec beaucoup d'utilisateurs
- Taille de la table `crm_logs` (croissance)
- Patterns d'utilisation anormaux

---

## 📞 Support

Pour toute question :
1. Consulter `ACTIVITY_LOGGER_GUIDE.md`
2. Vérifier la console du navigateur (F12)
3. Tester avec `test-activity-logger.html`
4. Vérifier les permissions RLS dans Supabase

---

**Version:** 1.0.0  
**Date:** 19 novembre 2025  
**Auteur:** AI Assistant  
**Status:** ✅ Production Ready
