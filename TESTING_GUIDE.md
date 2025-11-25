# Guide de Test du Système de Logging

## 🧪 Tests Manuels

### Test 1: Vérifier que le système se charge

1. **Ouvrir la console du navigateur** : `F12` → `Console`
2. **Vérifier que le logger est disponible** :
   ```javascript
   console.log(typeof activityLogger); // Doit afficher: "object"
   ```
3. **Vérifier que Supabase est initialisé** :
   ```javascript
   console.log(typeof window.supabaseClient); // Doit afficher: "object"
   ```

**✅ Résultat Attendu:**
- Pas d'erreur "activityLogger is not defined"
- `activityLogger` est un objet

---

### Test 2: Vérifier la connexion

1. **Naviguer vers** `login.html`
2. **Se connecter avec des identifiants valides**
3. **Ouvrir Supabase Dashboard** :
   - Aller dans `crm_logs`
   - Vérifier qu'un log "login" apparaît
   - Les colonnes doivent être :
     - `user_id`: ID de l'utilisateur connecté
     - `activity_type`: "login"
     - `details`: JSON avec email et timestamp

**✅ Résultat Attendu:**
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
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

---

### Test 3: Vérifier la déconnexion

1. **Depuis le Dashboard**, cliquer sur "Déconnexion"
2. **Ouvrir Supabase Dashboard** `crm_logs`
3. **Vérifier qu'un log "logout" apparaît** avec le même `user_id`
4. **Vérifier le timestamp** : créé immédiatement après le login

**✅ Résultat Attendu:**
- Log type "logout" pour le même user_id
- Timestamp ~1 minute après le login (rate limit)

---

### Test 4: Tester le Rate Limiting

**Scénario:** Se reconnecter dans la même minute

1. **Se connecter à 14:30:00** → Log créé ✅
2. **Se déconnecter à 14:30:15** → Pas de log (rate limit)
   - Ouvrir console : `console.log(activityLogger.canLog(7))` → `false`
3. **Se reconnecter à 14:31:05** → Log créé ✅

**✅ Résultat Attendu:**
- Logs séparés d'au moins 1 minute
- Console affiche "Rate limited" pour tentatives < 1min

---

### Test 5: Vérifier les données capturées

1. **Se connecter et ouvrir Supabase**
2. **Cliquer sur un log "login"**
3. **Vérifier les champs:**
   - `ip_address`: Adresse IP capturée ✅
   - `user_agent`: User Agent complet ✅
   - `details`: Email et timestamp ✅

**✅ Résultat Attendu:**
- Tous les champs sont remplis
- IP valide (ex: 192.168.x.x ou réseau)
- User Agent contient navigateur et système

---

## 🧪 Tests Automatisés

### Utiliser la Suite de Tests Interactive

1. **Ouvrir** `test-activity-logger.html` dans le navigateur
2. **Cliquer "✅ Initialiser la Connexion"**
3. **Observer l'état de la connexion** : doit montrer "Connecté"

### Tester le Logging

#### Test: Login

```javascript
// Bouton "🔑 Login"
1. Entrer User ID: 7
2. Cliquer "🔑 Login"
3. Attendre réponse: "✅ Login logged successfully" (en vert)
```

**Vérifier dans Supabase:**
```sql
SELECT * FROM crm_logs WHERE activity_type = 'login' 
ORDER BY created_at DESC LIMIT 1;
```

#### Test: Logout

```javascript
// Bouton "🚪 Logout"
1. Cliquer "🚪 Logout"
2. Observer: "✅ Logout logged successfully"
3. Vérifier dans Supabase
```

#### Test: Rate Limiting

```javascript
// Bouton "🚀 Logs Rapides (x5)"
1. Cliquer le bouton
2. Observer les résultats:
   - Log 1: ✅ Accepté
   - Log 2-5: ⏱️ Rate limited
```

**Résultat Attendu:**
```
[1/5] ✅ Log accepté
[2/5] ⏱️ Rate limited (cooldown: 59987ms)
[3/5] ⏱️ Rate limited (cooldown: 59988ms)
[4/5] ⏱️ Rate limited (cooldown: 59989ms)
[5/5] ⏱️ Rate limited (cooldown: 59990ms)
```

---

## 🔍 Tests de Récupération de Données

### Test: Récupérer les logs d'un utilisateur

1. **Suite de tests → Bouton "📋 Logs de l'Utilisateur"**
2. **Observer la console:**
   ```
   ✅ 5 logs trouvés pour l'utilisateur 7
   [1] login - 2025-11-19T14:23:45.123Z
   [2] logout - 2025-11-19T14:24:50.456Z
   ...
   ```

### Test: Récupérer tous les logs

1. **Suite de tests → Bouton "📚 Tous les Logs"**
2. **Observer:**
   ```
   ✅ 142 logs au total
   ```

### Test: Statistiques

1. **Suite de tests → Bouton "📈 Statistiques"**
2. **Observer:**
   ```
   📈 Statistiques pour l'utilisateur 7:
     Total queries: 156
     Logs générés: 16
   ```

---

## ✅ Checklist de Validation

### Avant le Déploiement

- [ ] ✅ `logActivity.js` charge sans erreur
- [ ] ✅ Logger s'initialise correctement
- [ ] ✅ Login loggé automatiquement
- [ ] ✅ Logout loggé automatiquement
- [ ] ✅ Rate limiting fonctionne (1 log/min/user)
- [ ] ✅ Données capturées complètement (IP, User-Agent, etc.)
- [ ] ✅ Tests passent sans erreur
- [ ] ✅ Supabase affiche les logs correctement
- [ ] ✅ Console sans erreur JavaScript

### Performance

- [ ] ✅ Le logging n'impacte pas le UX
- [ ] ✅ Pas d'attente bloquante
- [ ] ✅ Redirection après login rapide (~100ms)

### Sécurité

- [ ] ✅ IP capturée correctement
- [ ] ✅ User-Agent enregistré
- [ ] ✅ user_id valide à chaque log
- [ ] ✅ Erreurs gracieuses sans crash

---

## 🐛 Troubleshooting

### Problème: "activityLogger is not defined"

**Cause:** Le script `logActivity.js` n'est pas chargé

**Solution:**
1. Vérifier que `<script src="logActivity.js"></script>` est dans le HTML
2. Vérifier le chemin du fichier
3. Actualiser la page (Ctrl+F5)

### Problème: Logs n'apparaissent pas dans Supabase

**Causes possibles:**

1. **Permissions RLS** 
   - Vérifier les politiques dans Supabase
   - Activer les logs pour le user

2. **Client non initialisé**
   ```javascript
   console.log(activityLogger.supabaseClient); // Doit exister
   ```

3. **user_id incorrect**
   ```javascript
   console.log(window.currentUserId); // Doit être un nombre
   ```

### Problème: Rate limit bloque tous les logs

**Cause:** Cooldown de 60 secondes actif

**Solution:**
```javascript
// Vérifier le cooldown
console.log(activityLogger.getRemainingCooldown(userId));

// Réinitialiser (test seulement)
activityLogger.lastLogTime[userId] = 0;
```

### Problème: Erreur Supabase dans les logs

**Solution:**
1. Vérifier que la table `crm_logs` existe
2. Vérifier les colonnes: `id`, `created_at`, `user_id`, `activity_type`
3. Vérifier les permissions RLS

---

## 📊 Requêtes SQL de Vérification

### Vérifier les logs aujourd'hui

```sql
SELECT 
  user_id, 
  activity_type, 
  COUNT(*) as count,
  MAX(created_at) as latest
FROM crm_logs
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id, activity_type
ORDER BY user_id, latest DESC;
```

### Vérifier les logs d'un utilisateur

```sql
SELECT * 
FROM crm_logs
WHERE user_id = 7
ORDER BY created_at DESC
LIMIT 50;
```

### Vérifier les erreurs

```sql
SELECT * 
FROM crm_logs
WHERE activity_type LIKE '%error%'
ORDER BY created_at DESC;
```

### Statistiques d'activité

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_activities
FROM crm_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🎯 Résumé des Tests

| Test | Commande | Résultat Attendu |
|------|----------|-----------------|
| Logger Chargé | `typeof activityLogger` | `"object"` |
| Supabase Connecté | `typeof window.supabaseClient` | `"object"` |
| Login Loggé | Vérifier Supabase | 1 log type "login" |
| Logout Loggé | Vérifier Supabase | 1 log type "logout" |
| Rate Limiting | `canLog(userId)` | `false` après 1 log/min |
| IP Capturée | Vérifier log | IP valide |
| User-Agent | Vérifier log | User-Agent complet |

---

## 🎓 Points d'Apprentissage

### Concepts Importants

1. **Rate Limiting** : Limite 1 log par minute par utilisateur
2. **Fire-and-Forget** : Logging asynchrone sans blocage
3. **Sampling** : Requêtes Supabase échantillonnées (1/10)
4. **RLS** : Permissions au niveau des lignes dans Supabase

### Comportement Normal

- Premire connexion → 1 log immédiat
- Déconnexion < 1 min → Rate limited
- Reconnexion > 1 min → 1 log autorisé
- Test rapide (x5) → 1 log + 4 rate limited

---

**Prêt à tester? Commencer par le Test 1!** 🚀
