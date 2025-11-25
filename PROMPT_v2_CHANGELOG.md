# Prompt API - Changelog v2 (GPT-5 Compatible)

## 🔄 CHANGEMENTS MAJEURS

### ❌ SUPPRESSION COMPLÈTE: Action `set_email`

L'action `set_email` (programmer un email futur) a été **TOTALEMENT SUPPRIMÉE** du prompt.

**Avant (v1)** :
- 4 actions disponibles : `set_email`, `set_remind`, `send_email`, `send_visio`

**Après (v2)** :
- 3 actions uniquement : `send_email`, `set_remind`, `send_visio`

---

## 📋 TABLEAU DE MIGRATION

| Situation | v1 | v2 |
|-----------|----|----|
| Envoi immédiat de présentation | `send_email` | `send_email` ✅ |
| Prospect dit "rappelez-moi" | `set_remind` | `set_remind` ✅ |
| RDV confirmé | `send_visio` | `send_visio` ✅ |
| Prospect pas intéressé | `set_email` +25j | `set_remind` +14j ✅ |
| Relance douce après non-réponse | `set_email` +7j | `set_remind` +7j ✅ |
| Prospect doit réfléchir | `set_remind` +3j | `set_remind` +7j ✅ |

---

## 📝 CHANGEMENTS DE RÈGLES DE DÉLAI

### Situation : "pas intéressé" ou prospect froid
- **v1** : `set_email` programmé +25 jours
- **v2** : `set_remind` programmé +14 jours
- **Raison** : Favoriser l'appel téléphonique pour renouer le contact

### Situation : "je dois réfléchir"
- **v1** : `set_remind` +3 jours
- **v2** : `set_remind` +7 jours
- **Raison** : Plus de temps pour réflexion du prospect

### Situation : Pas de réponse (2ème relance)
- **v1** : `set_email` +7 jours
- **v2** : `set_remind` +14 jours
- **Raison** : Relance par appel au lieu d'email

### Situation : Pas de réponse (3ème relance+)
- **v1** : `set_email` +14 jours
- **v2** : `set_remind` +21 jours
- **Raison** : Relance par appel, délai plus long

---

## 🎯 CHANGEMENT DE STRATÉGIE

### Avant (v1)
- Emails programmés à l'avance pour relances froides
- Mix send_email + set_email pour notifications futures
- Moins de contacts téléphoniques

### Après (v2)
- **Priorité aux appels téléphoniques** pour relances
- Emails uniquement pour envois immédiats de contenu
- Plus d'interactions humaines (appels) que d'emails automatisés

**Bénéfice** : Meilleure réactivité, contact plus personnel, conversion potentiellement meilleure

---

## ✅ VALIDATIONS OBLIGATOIRES

Tous les JSON produits DOIVENT respecter :

```json
{
  "action": "send_email" | "set_remind" | "send_visio",  // JAMAIS "set_email"
  "type": "send_email" | "set_remind" | "send_visio",
  "title": "...",
  "content": {
    // Champs selon le type d'action
  }
}
```

---

## 🚫 ERREURS À ÉVITER

### ❌ NE PAS faire ceci :
```json
[
  {
    "action": "set_email",  // INTERDIT
    "type": "set_email",     // INTERDIT
    ...
  }
]
```

### ✅ TOUJOURS faire ceci :
```json
[
  {
    "action": "send_email",   // ✅ Envoi immédiat
    ...
  },
  {
    "action": "set_remind",   // ✅ Rappel futur
    ...
  },
  {
    "action": "send_visio"    // ✅ Invitation Teams
    ...
  }
]
```

---

## 📌 RÉSUMÉ POUR GPT-5

**Message clé à intégrer dans le prompt :**

> L'action `set_email` est TOTALEMENT SUPPRIMÉE et ne doit JAMAIS être utilisée.
> Les seules actions autorisées sont : `send_email`, `set_remind`, `send_visio`.
> Pour les relances futures, TOUJOURS utiliser `set_remind` au lieu de `set_email`.

---

## 🔗 Fichier modifié

- **Fichier** : `prompt_agent_improved.md`
- **Version** : v2
- **Compatible** : GPT-5, API n8n, Zapier, Make.com
- **Date de mise à jour** : 17 novembre 2025

---

**Fin du changelog**
