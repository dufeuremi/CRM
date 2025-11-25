# Configuration et Déploiement du Activity Logger

## ⚙️ Configuration

### Variables de Configuration

Le système peut être configuré en modifiant les constantes dans `logActivity.js` :

```javascript
class ActivityLogger {
    constructor() {
        // Configuration du rate limiting
        this.LOG_INTERVAL_MS = 60000; // 1 minute (en millisecondes)
        
        // Autres paramètres
        this.lastLogTime = {};      // Tracking des timestamps
        this.queryCount = {};        // Compteur de requêtes
    }
}
```

### Paramètres Modifiables

| Paramètre | Valeur Défaut | Signification |
|-----------|---------------|--------------|
| `LOG_INTERVAL_MS` | `60000` | Intervalle minimum entre deux logs (ms) |
| `SAMPLING_RATE` | `10` | Log 1 requête sur N (logs Supabase) |

### Exemple: Modifier le Rate Limit

Pour passer à **2 minutes** par log :

```javascript
// Dans logActivity.js
this.LOG_INTERVAL_MS = 120000; // 2 minutes
```

---

## 🔐 Configuration Supabase

### Créer la Table `crm_logs`

Si la table n'existe pas, l'exécuter dans l'éditeur SQL Supabase :

```sql
-- Créer la table crm_logs
CREATE TABLE crm_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id SMALLINT NOT NULL,
    activity_type TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    timestamp TEXT,
    FOREIGN KEY (user_id) REFERENCES crm_users(id) ON DELETE CASCADE
);

-- Index pour performances
CREATE INDEX idx_crm_logs_user_id ON crm_logs(user_id);
CREATE INDEX idx_crm_logs_created_at ON crm_logs(created_at);
CREATE INDEX idx_crm_logs_activity_type ON crm_logs(activity_type);

-- Index composite pour requêtes courantes
CREATE INDEX idx_crm_logs_user_date ON crm_logs(user_id, created_at DESC);
```

### Configuration RLS (Row Level Security)

**Option 1: Lectures propres logs seulement**

```sql
-- Permettre aux utilisateurs de lire LEURS propres logs
CREATE POLICY "Users can view their own logs"
ON crm_logs FOR SELECT
USING (user_id = (SELECT id FROM crm_users WHERE auth_id = auth.uid()));

-- Permettre l'insertion (système)
CREATE POLICY "System can insert logs"
ON crm_logs FOR INSERT
WITH CHECK (true);
```

**Option 2: Lectures complètes (pour admin)**

```sql
-- Lectures complètes (utiliser avec caution!)
ALTER TABLE crm_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all logged in users"
ON crm_logs FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all"
ON crm_logs FOR INSERT
WITH CHECK (true);
```

**Option 3: Désactiver RLS (test seulement)**

```sql
-- ⚠️ ATTENTION: Désactiver RLS en production uniquement si sûr
ALTER TABLE crm_logs DISABLE ROW LEVEL SECURITY;
```

---

## 📦 Fichiers Nécessaires

### Fichiers Critiques

- ✅ `logActivity.js` - **REQUIS** (système de logging)
- ✅ `login.html` - Modifié (pour login logging)
- ✅ `dashboard.html` - Modifié (pour initialisation)
- ✅ `script.js` - Modifié (pour logout logging)

### Fichiers Optionnels

- 📚 `ACTIVITY_LOGGER_GUIDE.md` - Documentation
- 📚 `ACTIVITY_LOGGER_IMPLEMENTATION.md` - Détails techniques
- 🧪 `test-activity-logger.html` - Suite de tests
- 📚 `TESTING_GUIDE.md` - Guide de test
- ⚙️ `CONFIGURATION_DEPLOYMENT.md` - Ce fichier

---

## 🚀 Déploiement

### Étape 1: Préparer la Base de Données

1. **Ouvrir Supabase Dashboard**
2. **Accéder à l'éditeur SQL**
3. **Exécuter le script de création de table** (voir ci-dessus)
4. **Vérifier que la table est créée** : naviguer dans l'onglet "crm_logs"

### Étape 2: Déployer les Fichiers

1. **Copier `logActivity.js`** dans le dossier racine du CRM
2. **Vérifier que les modifications HTML sont présentes**:
   - `login.html` line ~199: `<script src="logActivity.js"></script>`
   - `dashboard.html` line ~16: `<script src="logActivity.js"></script>`
   - `dashboard.html` line ~1246: `activityLogger.setSupabaseClient(supabase);`
   - `script.js` line ~6051: Logging de logout

### Étape 3: Tester le Déploiement

1. **Ouvrir login.html**
2. **Se connecter avec un compte test**
3. **Vérifier dans Supabase** que le log apparaît
4. **Vérifier les champs**: user_id, activity_type, ip_address, user_agent

### Étape 4: Valider en Production

1. **Tester avec plusieurs utilisateurs**
2. **Vérifier le rate limiting** (logs séparés d'1 min)
3. **Vérifier les performances** (aucun impact sur UX)
4. **Monitorez les 24 premières heures**

---

## 📊 Monitoring

### Dashboard de Monitoring (Requis)

**À créer manuellement dans Supabase :**

```javascript
// Requête: Activités par heure
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as users
FROM crm_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

// Requête: Top utilisateurs actifs
SELECT 
  user_id,
  COUNT(*) as activities,
  MAX(created_at) as last_seen
FROM crm_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY activities DESC
LIMIT 20;
```

### Alertes à Configurer

1. **Aucun log pendant 1h** → Alerte admin
2. **Plus de 1000 logs/jour** → Vérifier DB
3. **Erreur d'insertion** → Logger en erreur

---

## 🔧 Maintenance

### Nettoyage Quotidien

```javascript
// À ajouter dans une tâche CRON ou Lambda
// Exécuter chaque jour à minuit
activityLogger.resetQueryStats();
```

### Nettoyage Mensuel

```javascript
// À ajouter dans une tâche CRON
// Exécuter le 1er de chaque mois
await activityLogger.clearOldLogs(30); // Supprimer logs > 30 jours
```

### Archivage (Optionnel)

Pour conserver l'historique complet :

```sql
-- Copier logs anciens dans une table d'archivage
INSERT INTO crm_logs_archive
SELECT * FROM crm_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Supprimer les logs archivés
DELETE FROM crm_logs
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 🔍 Vérification Post-Déploiement

### Checklist

- [ ] Table `crm_logs` créée dans Supabase
- [ ] RLS configurée correctement
- [ ] Fichier `logActivity.js` copié
- [ ] Scripts modifiés chargent le logger
- [ ] Login logging fonctionne
- [ ] Logout logging fonctionne
- [ ] Rate limiting appliqué (1 log/min)
- [ ] IP capturée correctement
- [ ] User-Agent enregistré
- [ ] Aucune erreur console

### Requête de Vérification

```sql
-- Vérifier les 10 derniers logs
SELECT * FROM crm_logs 
ORDER BY created_at DESC 
LIMIT 10;

-- Doit afficher:
-- id | created_at | user_id | activity_type | details | ip_address | user_agent | timestamp
```

---

## 🚨 Troubleshooting Déploiement

### Erreur: "Table crm_logs does not exist"

**Cause:** La table n'a pas été créée

**Solution:**
1. Ouvrir Supabase SQL editor
2. Exécuter le script de création (voir section Configuration Supabase)
3. Vérifier que la table apparaît

### Erreur: "Permission denied"

**Cause:** RLS bloque les insertions

**Solution:**
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'crm_logs';

-- Si besoin, désactiver temporairement
ALTER TABLE crm_logs DISABLE ROW LEVEL SECURITY;

-- Puis reconfigurer correctement
```

### Erreur: "userId is required"

**Cause:** `user_id` null ou undefined

**Solution:**
1. Vérifier que `window.currentUserId` est défini
2. Vérifier la jointure crm_users lors du login
3. Activer les logs console pour déboguer

### Logs n'apparaissent pas

**Checklist:**
1. Vérifier que Supabase est connecté
2. Vérifier que user_id est valide
3. Vérifier que logger est initialisé
4. Vérifier que RLS n'est pas trop restrictive
5. Vérifier qu'il n'y a pas de rate limit

---

## 📈 Évolution Future

### Améliorations Possibles

1. **Dashboard Analytics** - Afficher les logs en temps réel
2. **Alertes** - Notifier sur activités suspectes
3. **Export** - Exporter en CSV/PDF
4. **Archive** - Archiver les anciens logs
5. **Webhooks** - Déclencher actions sur certains logs

### Performance à Long Terme

- **Partitioning** : Partitionner par date si table > 10M rows
- **Compression** : Compresser les anciens logs
- **Backup** : Sauvegarder les logs régulièrement

---

## 📞 Support et Documentation

### Fichiers de Référence

- `ACTIVITY_LOGGER_GUIDE.md` - Guide complet d'utilisation
- `ACTIVITY_LOGGER_IMPLEMENTATION.md` - Détails techniques
- `TESTING_GUIDE.md` - Guide de test
- `logActivity.js` - Code source commenté

### Diagnostic

```javascript
// Diagnostic complet
console.log({
    logger: typeof activityLogger,
    supabase: typeof window.supabaseClient,
    userId: window.currentUserId,
    canLog: activityLogger?.canLog(window.currentUserId),
    cooldown: activityLogger?.getRemainingCooldown(window.currentUserId)
});
```

---

## 📋 Annexe: Schéma de Données

```json
{
  "crm_logs": {
    "id": "bigint PRIMARY KEY",
    "created_at": "timestamp with time zone DEFAULT NOW()",
    "user_id": "smallint FOREIGN KEY → crm_users.id",
    "activity_type": "text (enum: login, logout, api_call, export, supabase_query, custom)",
    "details": "jsonb (flexible, dépend du type)",
    "ip_address": "text (best-effort)",
    "user_agent": "text (navigateur + système)",
    "timestamp": "text (ISO 8601)"
  }
}
```

---

**Dernière mise à jour:** 19 novembre 2025  
**Version:** 1.0.0  
**Status:** ✅ Prêt pour production
