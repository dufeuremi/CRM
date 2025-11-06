# CRM BDR - Cold Calling

Application CRM simple pour les Business Development Representatives (BDR) spécialisés dans le cold calling.

## Structure du projet

- `index.html` - Structure HTML principale
- `styles.css` - Styles CSS de l'application
- `script.js` - Logique JavaScript et fonctions API

## Fonctionnalités

- **Sidebar rétractable** avec navigation entre les sections
- **Dashboard** - Vue d'ensemble des statistiques
- **Disponibilités** - Gestion des créneaux disponibles
- **Prospects** - Liste et gestion des prospects

## Utilisation

1. Ouvrir `index.html` dans un navigateur web
2. La sidebar peut être rétractée en cliquant sur le bouton de toggle
3. Navigation entre les sections via le menu latéral

## API

L'application est prête pour intégrer des appels API. Les fonctions API sont disponibles dans `script.js` avec la structure `API` :

- `API.get(endpoint)` - Requête GET
- `API.post(endpoint, data)` - Requête POST
- `API.put(endpoint, data)` - Requête PUT
- `API.delete(endpoint)` - Requête DELETE

Modifiez `API.baseUrl` selon votre backend.

## Technologies

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript (ES6+)
- Font Awesome 6.4.0 (icônes)

