# Guide d'utilisation du Cache Buster

## Problème résolu

Ce système résout le problème du cache navigateur qui empêche les utilisateurs de voir les dernières versions des fichiers CSS et JS après une mise à jour.

## Installation

### Méthode 1 : Activation automatique (Recommandée)

Ajoutez ce code dans le `<head>` de vos pages HTML **avant** les autres scripts :

```html
<!-- Cache Buster - À charger en premier -->
<script src="cache-buster.js"></script>
<script>
    CacheBuster.config.version = '2.0.0'; // Changez ce numéro à chaque déploiement
    CacheBuster.init();
</script>
```

### Méthode 2 : Version automatique avec timestamp

```html
<script src="cache-buster.js"></script>
<script>
    // Utilise automatiquement Date.now() comme version
    CacheBuster.init();
</script>
```

### Méthode 3 : Application manuelle sur des fichiers spécifiques

```html
<script src="cache-buster.js"></script>
<link rel="stylesheet" href="styles.css" id="mainStyles">
<script src="script.js" id="mainScript"></script>

<script>
    // Versionnez manuellement des fichiers spécifiques
    document.getElementById('mainStyles').href = CacheBuster.addVersion('styles.css');
    document.getElementById('mainScript').src = CacheBuster.addVersion('script.js');
</script>
```

## Utilisation avancée

### Charger dynamiquement des fichiers avec version

```javascript
// Charger un CSS
CacheBuster.loadCSS('nouveau-style.css');

// Charger un JS
CacheBuster.loadJS('nouveau-script.js').then(() => {
    console.log('Script chargé avec succès');
});
```

### Recharger un fichier CSS spécifique

```javascript
// Force le rechargement d'un CSS
CacheBuster.reloadCSS('styles.css');
```

### Mettre à jour la version dynamiquement

```javascript
// Mettre à jour avec un nouveau numéro de version
CacheBuster.updateVersion('2.1.0');

// Ou avec un timestamp
CacheBuster.updateVersion();
```

## Configuration personnalisée

```javascript
// Personnaliser la configuration
CacheBuster.config.version = 'ma-version-custom';

// Modifier les patterns de fichiers à versionner
CacheBuster.config.patterns.css = /\.css$/;
CacheBuster.config.patterns.js = /\.js$/;
```

## Stratégies de versionnage

### 1. Version manuelle (Production)
- Changez le numéro de version à chaque déploiement
- Exemple : `1.0.0`, `1.0.1`, `2.0.0`
- Avantage : Contrôle total
- Inconvénient : Nécessite de penser à l'incrémenter

### 2. Timestamp automatique (Développement)
- Utilise `Date.now()` automatiquement
- Change à chaque rechargement de page
- Avantage : Aucune maintenance
- Inconvénient : Pas de cache du tout en développement

### 3. Variable d'environnement (CI/CD)
- Injectez la version depuis votre pipeline
- Exemple : Numéro de build, hash de commit Git
- Avantage : Automatique et traçable
- Inconvénient : Nécessite une configuration CI/CD

## Exemples d'intégration

### Pour index.html et login.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Application</title>

    <!-- Cache Buster -->
    <script src="cache-buster.js"></script>
    <script>
        CacheBuster.config.version = '1.0.0'; // Changez à chaque mise à jour
        CacheBuster.init();
    </script>

    <!-- Vos fichiers CSS et JS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Contenu -->
</body>
</html>
```

### Pour dashboard.html avec plusieurs fichiers

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>

    <!-- Cache Buster -->
    <script src="cache-buster.js"></script>
    <script>
        CacheBuster.config.version = '1.0.0';
        CacheBuster.init();
    </script>

    <!-- Ces fichiers seront automatiquement versionnés -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="mails_styles.css">

    <!-- Scripts externes (ignorés automatiquement) -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Scripts locaux (versionnés automatiquement) -->
    <script src="script.js"></script>
    <script src="analytics.js"></script>
</head>
<body>
    <!-- Contenu -->
</body>
</html>
```

## Vérification

Pour vérifier que le cache buster fonctionne :

1. Ouvrez la console navigateur (F12)
2. Rechargez la page
3. Vous devriez voir : `🔄 Cache Buster activé - Version: 1.0.0`
4. Dans l'onglet Network/Réseau, vérifiez que les fichiers CSS/JS ont `?v=1.0.0` dans leur URL

## Workflow recommandé

1. **Développement** : Utilisez la version automatique avec timestamp
   ```javascript
   CacheBuster.init(); // Utilise Date.now() par défaut
   ```

2. **Production** : Utilisez une version manuelle que vous incrémentez
   ```javascript
   CacheBuster.config.version = '1.0.5';
   CacheBuster.init();
   ```

3. **CI/CD** : Injectez automatiquement la version depuis votre pipeline
   ```javascript
   CacheBuster.config.version = '${BUILD_NUMBER}';
   CacheBuster.init();
   ```

## Dépannage

### Les fichiers ne se rechargent pas
- Vérifiez que cache-buster.js est chargé en premier
- Vérifiez la console pour les erreurs
- Assurez-vous que `CacheBuster.init()` est appelé

### Certains fichiers ne sont pas versionnés
- Vérifiez qu'ils ne sont pas sur un CDN externe
- Les fichiers sur CDN (http://, https://) sont ignorés automatiquement

### La version ne change pas
- Vérifiez que vous appelez `CacheBuster.config.version = 'nouvelle-version'` avant `init()`
- Ou utilisez `CacheBuster.updateVersion('nouvelle-version')`
