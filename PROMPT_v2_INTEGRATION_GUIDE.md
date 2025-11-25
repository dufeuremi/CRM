# Guide d'intégration - Prompt v2 GPT-5

## 🔧 Intégration pas à pas

### Étape 1 : Sauvegarde
```
Faire une copie du prompt v1 (ancien prompt) en cas de rollback
Chemin : prompt_agent_improved.md
```

### Étape 2 : Remplacement
```
Copier le contenu ENTIER du prompt v2 depuis prompt_agent_improved.md
Remplacer le prompt dans :
  - n8n (node GPT)
  - Make.com (module OpenAI)
  - Zapier (si utilisé)
  - Votre API directe
```

### Étape 3 : Test
```
Tester avec au minimum les 3 cas critiques :
  ✅ Cas 2 : Prospect pas intéressé → Doit être set_remind, PAS set_email
  ✅ Cas 3 : Demande présentation → Doit être send_email immédiat
  ✅ Cas 5 : Multiple actions → Pas de set_email, seulement set_remind
```

### Étape 4 : Validation
```
Vérifier la réponse JSON :
  ✅ Array valide [ ... ]
  ✅ Pas d'action "set_email"
  ✅ Dates format YYYY-MM-DD
  ✅ Heures format HH:MM (multiples de 5)
  ✅ Pas de texte avant/après JSON
```

### Étape 5 : Production
```
Basculer en production une fois validé
Monitorer les réponses les premiers jours
```

---

## 📊 Configuration dans n8n

### Node OpenAI / ChatGPT

**Settings** :
```
Model: gpt-5 (ou compatible)
Temperature: 0.3 (déterministe)
Max tokens: 2000
Top-p: 1
```

**System Prompt** :
```
Copier-coller le contenu entier du prompt_agent_improved.md v2
```

**User Message** :
```
Utiliser les templates de variables Supabase :
- {{ $('get prospect').item.json.* }}
- {{ $('get user').item.json.* }}
- {{ $now }}
```

---

## 🔍 Vérification des réponses

### ✅ Réponse VALIDE (v2)

Exemple de réponse correcte :
```json
[
  {
    "action": "send_email",
    "type": "send_email",
    "title": "Email présentation Jean Dupont",
    "content": {
      "send_date": "2025-11-17",
      "send_time": "14:35",
      "subject": "Présentation Taskalys",
      "body": "<div>...</div>",
      "recipient": "jean@company.com"
    }
  }
]
```

### ❌ Réponse INVALIDE (Rejeter)

```json
[
  {
    "action": "set_email",  // ❌ Interdit en v2
    "type": "set_email",
    "content": {...}
  }
]
```

### ⚠️ Réponse SUSPECTE (Vérifier)

```json
[
  {
    "action": "send_email",
    "content": {
      "send_date": "2025-11-17",
      "send_time": "14:37"  // ⚠️ 37 n'est pas multiple de 5
    }
  }
]
```

---

## 🛠️ Debugging

### Problème : set_email toujours retourné

**Solutions** :
1. Copier-coller le prompt complet (pas juste partiel)
2. Vérifier que le prompt contient "JAMAIS set_email"
3. Augmenter Temperature à 0.2
4. Ajouter une validation dans n8n pour rejeter set_email

### Problème : Dates mal formatées

**Solutions** :
1. Vérifier le format du prompt (YYYY-MM-DD)
2. Ajouter un node JavaScript de formatage en n8n
3. Vérifier que {{ $now }} retourne le bon format

### Problème : Heures non-multiples de 5

**Solutions** :
1. Ajouter un node JavaScript pour arrondir
2. Augmenter la précision du prompt sur "multiples de 5"
3. Valider en n8n : `time % 5 === 0`

---

## 📋 Node n8n JavaScript (Validation)

```javascript
// Valider la réponse JSON
function validateResponse(response) {
  try {
    const json = JSON.parse(response);
    
    // Vérifier que c'est un array
    if (!Array.isArray(json)) {
      return { valid: false, error: "Pas un array" };
    }
    
    // Vérifier chaque action
    for (let action of json) {
      if (action.action === "set_email") {
        return { valid: false, error: "set_email interdit en v2" };
      }
      
      if (!["send_email", "set_remind", "send_visio"].includes(action.action)) {
        return { valid: false, error: `Action inconnue: ${action.action}` };
      }
      
      // Vérifier format heure
      if (action.content.send_time || action.content.remind_time || action.content.meeting_time) {
        const time = action.content.send_time || action.content.remind_time || action.content.meeting_time;
        const minutes = parseInt(time.split(':')[1]);
        if (minutes % 5 !== 0) {
          return { valid: false, error: `Minutes invalides: ${minutes}` };
        }
      }
    }
    
    return { valid: true, data: json };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

// Utilisation dans n8n
return validateResponse(input);
```

---

## 📞 Monitoring

### Ajouter à votre dashboard

**Métriques à tracker** :
- % réponses avec set_email (doit être 0%)
- % send_email corrects
- % set_remind corrects
- % send_visio corrects
- % erreurs format

**Alert si** :
- Set_email > 0% → Prompt cassé
- Erreurs > 5% → Investigation

---

## 🔄 Migration depuis v1

### Étape 1 : Identifier les workflows
```
Chercher les nodes qui utilisent "set_email"
Note : Tous les set_email v1 doivent devenir set_remind v2
```

### Étape 2 : Mettre à jour les traitement
```
Ajuster les nodes suivants si existants :
- Node qui traite "set_email" →
  À changer pour traiter "set_remind"
- Node de scheduling →
  Peut rester identique
```

### Étape 3 : Tester la migration
```
Lancer les 5 cas de test sur l'ancien + nouveau prompt
Comparer les résultats
S'assurer que nouveaux résultats sont v2-compatibles
```

### Étape 4 : Déployer progressivement
```
Jour 1 : 10% trafic sur v2
Jour 2 : 25% trafic
Jour 3 : 50% trafic
Jour 4 : 100% trafic v2
```

---

## 📞 Support & Questions

### Questions fréquentes

**Q: Pourquoi supprimer set_email ?**
R: Les relances par appel (set_remind) ont un meilleur taux de réponse que les emails programmés.

**Q: Et les relances froides existantes ?**
R: Elles deviennent des appels téléphoniques (plus personnel).

**Q: Peut-on garder set_email ?**
R: Non, le prompt v2 ne l'accepte pas. Utiliser set_remind à la place.

**Q: Comment gérer les zones horaires ?**
R: Adapter {{ $now }} pour inclure le fuseau horaire du commercial.

---

## ✅ Checklist finale

- [ ] Prompt v2 copié
- [ ] Testé avec 3 cas critiques
- [ ] Pas de set_email retourné
- [ ] Validation n8n en place
- [ ] Monitoring configuré
- [ ] Documentation mise à jour
- [ ] Équipe informée des changements
- [ ] Prêt pour production

---

**Version** : 2.0 - Guide d'intégration
**Date** : 17 novembre 2025
**Contact** : À adapter selon votre équipe
