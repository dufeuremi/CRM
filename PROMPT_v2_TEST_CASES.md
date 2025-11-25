# Validation du Prompt v2 - Cas de test

## ✅ CAS DE TEST 1 : Prospect intéressé, demande réflexion

**Entrée (Transcription)** :
```
"Oui c'est intéressant. Je vais en parler à mes collègues et je vous recontacte."
```

**Résultat attendu (v2)** :
```json
[
  {
    "action": "set_remind",
    "type": "set_remind",
    "title": "Rappel [Prospect] après consultation équipe",
    "content": {
      "remind_date": "2025-11-24",
      "remind_time": "14:30",
      "message": "Contexte : Prospect intéressé (temp 4/5), doit consulter équipe...\n\nPoints à aborder :\n- Retour équipe\n- Questions\n- Besoins spécifiques\n\nObjectif : Obtenir RDV"
    }
  }
]
```

**Validation** :
- ✅ Action = `set_remind` (pas set_email)
- ✅ Délai = +7j (2025-11-24)
- ✅ Format date/heure séparé

---

## ✅ CAS DE TEST 2 : Prospect pas intéressé

**Entrée (Transcription)** :
```
"Écoutez, on n'a vraiment pas le temps pour ça. Peut-être plus tard."
```

**Résultat attendu (v2)** :
```json
[
  {
    "action": "set_remind",
    "type": "set_remind",
    "title": "Relance douce [Prospect]",
    "content": {
      "remind_date": "2025-12-01",
      "remind_time": "10:00",
      "message": "Contexte : Prospect pas intéressé immédiatement (temp 1-2)...\n\nPoints à aborder :\n- Vérifier si situation a évolué\n- Partager cas d'usage\n- Proposer appel découverte\n\nObjectif : Relancer en mode soft"
    }
  }
]
```

**Validation** :
- ✅ Action = `set_remind` (PAS set_email +25j)
- ✅ Délai = +14j (2025-12-01)
- ✅ Ton soft/sans pression

---

## ✅ CAS DE TEST 3 : Demande immédiate de présentation

**Entrée (Transcription)** :
```
"C'est super. Envoyez-moi votre présentation par email."
```

**Résultat attendu (v2)** :
```json
[
  {
    "action": "send_email",
    "type": "send_email",
    "title": "Email présentation [Prospect]",
    "content": {
      "send_date": "2025-11-17",
      "send_time": "14:35",
      "subject": "Présentation Taskalys - Solutions d'automatisation",
      "body": "<div style='font-family: Arial; color: #333;'>...",
      "recipient": "prospect@company.com"
    }
  }
]
```

**Validation** :
- ✅ Action = `send_email`
- ✅ Délai = immédiat (dans 5 min)
- ✅ Date/heure = maintenant +5min

---

## ✅ CAS DE TEST 4 : RDV confirmé

**Entrée (Transcription)** :
```
"D'accord ! Jeudi 20 novembre à 15h, c'est bon pour vous ?"
```

**Résultat attendu (v2)** :
```json
[
  {
    "action": "send_visio",
    "type": "send_visio",
    "title": "Invitation RDV [Prospect]",
    "content": {
      "meeting_date": "2025-11-20",
      "meeting_time": "15:00",
      "recipients": "prospect@company.com",
      "subject": "Taskalys x [Entreprise] | Rendez-vous découverte"
    }
  }
]
```

**Validation** :
- ✅ Action = `send_visio`
- ✅ Date/heure exactes du RDV
- ✅ Pas de set_email

---

## ✅ CAS DE TEST 5 : Multiple actions (Présentation + Rappel)

**Entrée (Transcription)** :
```
"Envoyez-moi la présentation. Et rappelez-moi dans 3 jours si j'y ai réfléchi."
```

**Résultat attendu (v2)** :
```json
[
  {
    "action": "send_email",
    "type": "send_email",
    "title": "Email présentation [Prospect]",
    "content": {
      "send_date": "2025-11-17",
      "send_time": "14:35",
      "subject": "Présentation Taskalys",
      "body": "...",
      "recipient": "prospect@company.com"
    }
  },
  {
    "action": "set_remind",
    "type": "set_remind",
    "title": "Rappel [Prospect] après réflexion",
    "content": {
      "remind_date": "2025-11-20",
      "remind_time": "10:00",
      "message": "Contexte : Prospect a reçu présentation...\n\nPoints à aborder :\n- Avis sur présentation\n- Questions\n- Intérêt confirmé\n\nObjectif : Valider intérêt, proposer démo"
    }
  }
]
```

**Validation** :
- ✅ Array avec 2 actions
- ✅ send_email en premier (immédiat)
- ✅ set_remind en second (futur)
- ✅ Pas de set_email

---

## ❌ ERREURS À NE PAS FAIRE (v2)

### ❌ ERREUR 1 : Utiliser set_email
```json
[
  {
    "action": "set_email",  // ❌ INTERDIT en v2
    "type": "set_email",
    "content": {
      "send_date": "2025-11-25T10:00:00",
      "subject": "Relance",
      "body": "...",
      "recipient": "..."
    }
  }
]
```

### ❌ ERREUR 2 : Format datetime unifié au lieu de séparé
```json
{
  "content": {
    "send_date": "2025-11-17T14:35:00"  // ❌ Unifié (v1 style)
  }
}
```

**Correct** :
```json
{
  "content": {
    "send_date": "2025-11-17",           // ✅ Séparé
    "send_time": "14:35"
  }
}
```

### ❌ ERREUR 3 : Minutes non-multiples de 5
```json
{
  "remind_time": "14:37"  // ❌ 37 n'est pas multiple de 5
}
```

**Correct** :
```json
{
  "remind_time": "14:35"  // ✅ 35 est multiple de 5
}
```

---

## 📊 MATRICE DE DÉCISION v2

| Situation | Action | Délai | Format |
|-----------|--------|-------|--------|
| Envoi immédiat | `send_email` | 0-5 min | date + time |
| Rappel demandé | `set_remind` | +1j à +21j | date + time |
| RDV confirmé | `send_visio` | immédiat | date + time |
| Réflexion requise | `set_remind` | +7j | date + time |
| Pas intéressé | `set_remind` | +14j | date + time |
| Non-réponse 1 | `set_remind` | +7j | date + time |
| Non-réponse 2 | `set_remind` | +14j | date + time |
| Non-réponse 3+ | `set_remind` | +21j | date + time |

**Règle clé** : JAMAIS `set_email` en v2

---

## 🎯 VALIDATION CHECKLIST

Avant d'envoyer un JSON, vérifier :

- [ ] Array JSON valide (commence par `[`, finit par `]`)
- [ ] 1 à 3 objets dans l'array
- [ ] `action` = `send_email` OU `set_remind` OU `send_visio`
- [ ] `action` ≠ `set_email` (JAMAIS)
- [ ] `type` = même valeur que `action`
- [ ] `title` sans saut de ligne
- [ ] Dates format `YYYY-MM-DD`
- [ ] Heures format `HH:MM`
- [ ] Minutes = multiple de 5 (00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
- [ ] Dates > maintenant
- [ ] Recipients = email valide
- [ ] Subject = string non-vide
- [ ] Body = HTML valide (si send_email)
- [ ] Message = structure + contexte (si set_remind)
- [ ] Pas de texte avant le JSON
- [ ] Pas de texte après le JSON

---

**Fin des cas de test v2**
