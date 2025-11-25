# Cache Buster - Système de gestion de versions automatique

## Problème résolu

Les utilisateurs ne voient pas les mises à jour de vos fichiers CSS et JS à cause du cache du navigateur. Ce système force automatiquement le rechargement en ajoutant une version unique aux fichiers.

## Fichiers créés

1. **cache-buster.js** - Le script principal qui gère le versioning
2. **CACHE_BUSTER_GUIDE.md** - Documentation complète
3. **test-cache-buster.html** - Page de test interactive
4. **update-version.js** - Script Node.js pour mettre à jour toutes les versions
5. **update-version.bat** - Script Windows pour faciliter les mises à jour

## Démarrage rapide

### 1. Le système est déjà intégré

Les fichiers suivants ont été mis à jour avec le Cache Buster :
- ✅ index.html
- ✅ dashboard.html

### 2. Quand mettre à jour la version

À chaque fois que vous modifiez vos fichiers CSS ou JS :

**Option A - Via script (recommandé)**
```bash
# Windows
update-version.bat 1.0.1

# Ou avec un timestamp
update-version.bat timestamp
```

**Option B - Manuellement**
Ouvrez chaque fichier HTML et changez :
```javascript
CacheBuster.config.version = '1.0.0'; // Changez ce numéro
```

### 3. Vérifier que ça fonctionne

1. Ouvrez `test-cache-buster.html` dans votre navigateur
2. Ouvrez la console (F12)
3. Vous devriez voir : `🔄 Cache Buster activé - Version: 1.0.0`
4. Vérifiez que vos fichiers CSS/JS ont `?v=1.0.0` dans leur URL

## Utilisation quotidienne

### Workflow de développement

1. Faites vos modifications dans CSS/JS
2. Lancez : `update-version.bat timestamp`
3. Testez dans le navigateur
4. Les utilisateurs verront automatiquement les changements

### Workflow de production

1. Faites vos modifications
2. Lancez : `update-version.bat 1.0.1` (incrémentez le numéro)
3. Committez et déployez
4. Les utilisateurs recevront automatiquement la nouvelle version

## Comment ça marche

Le Cache Buster :
1. Trouve tous vos fichiers CSS et JS locaux
2. Ajoute automatiquement `?v=VERSION` à chaque URL
3. Ignore les CDN externes (comme unpkg, cdn.jsdelivr.net, etc.)
4. Force le navigateur à recharger quand la version change

## Exemple

**Avant :**
```html
<link rel="stylesheet" href="styles.css">
```

**Après chargement de la page :**
```html
<link rel="stylesheet" href="styles.css?v=1.0.0">
```

**Quand vous changez la version à 1.0.1 :**
```html
<link rel="stylesheet" href="styles.css?v=1.0.1">
```

Le navigateur voit une URL différente → télécharge le nouveau fichier !

## Fichiers versionnés automatiquement

✅ styles.css
✅ mails_styles.css
✅ script.js
✅ analytics.js
✅ logActivity.js
✅ Tout autre fichier CSS/JS local que vous ajouterez

❌ CDN externes (ignorés automatiquement) :
- unpkg.com
- cdn.jsdelivr.net
- cdnjs.cloudflare.com
- etc.

## Commandes disponibles

```bash
# Mettre à jour avec une version spécifique
update-version.bat 1.0.0
update-version.bat 2.1.5

# Utiliser un timestamp (change à chaque fois)
update-version.bat timestamp

# Tester le système
# Ouvrir test-cache-buster.html dans le navigateur
```

## Intégrer dans de nouveaux fichiers HTML

Ajoutez ce code dans le `<head>` de vos nouveaux fichiers HTML :

```html
<head>
    <!-- Autres meta tags -->

    <!-- Cache Buster - À charger en PREMIER -->
    <script src="cache-buster.js"></script>
    <script>
        CacheBuster.config.version = '1.0.0';
        CacheBuster.init();
    </script>

    <!-- Vos fichiers CSS/JS -->
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>
```

## Support

Pour plus de détails, consultez :
- **CACHE_BUSTER_GUIDE.md** - Documentation complète
- **test-cache-buster.html** - Interface de test interactive

## FAQ

**Q: Dois-je changer la version à chaque modification ?**
R: Oui, sinon les utilisateurs ne verront pas vos changements.

**Q: Puis-je utiliser un timestamp automatique ?**
R: Oui avec `update-version.bat timestamp`, mais préférez une version manuelle en production.

**Q: Les CDN sont-ils affectés ?**
R: Non, les fichiers externes sont automatiquement ignorés.

**Q: Comment savoir si ça marche ?**
R: Ouvrez la console (F12) → vous verrez "Cache Buster activé" avec la version.

**Q: Puis-je l'utiliser en production ?**
R: Oui ! C'est fait pour ça. Changez juste la version à chaque déploiement.
