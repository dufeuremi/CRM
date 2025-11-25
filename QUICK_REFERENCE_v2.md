# Quick Reference - Prompt v2 GPT-5

## 🚀 TL;DR

**L'action `set_email` est SUPPRIMÉE** ❌

Utilisez uniquement :
- ✅ `send_email` - Envoi immédiat
- ✅ `set_remind` - Rappel futur
- ✅ `send_visio` - RDV Teams

---

## 📋 Actions rapides

### send_email (Immédiat)
```json
{
  "action": "send_email",
  "content": {
    "send_date": "2025-11-17",
    "send_time": "14:35",
    "subject": "Sujet",
    "body": "<p>HTML</p>",
    "recipient": "email@company.com"
  }
}
```

### set_remind (Futur)
```json
{
  "action": "set_remind",
  "content": {
    "remind_date": "2025-11-24",
    "remind_time": "14:00",
    "message": "Contexte...\n\nPoints...\n\nObjectif..."
  }
}
```

### send_visio (RDV)
```json
{
  "action": "send_visio",
  "content": {
    "meeting_date": "2025-11-20",
    "meeting_time": "15:00",
    "recipients": "email@company.com",
    "subject": "RDV Taskalys"
  }
}
```

---

## ⏱️ Délais standard

| Cas | Action | Délai |
|-----|--------|-------|
| Envoi présentation | send_email | 0-5 min |
| Consultation équipe | set_remind | +7j |
| Rappel demandé | set_remind | +1j |
| Pas intéressé | set_remind | +14j |
| Non-réponse 1x | set_remind | +7j |
| Non-réponse 2x | set_remind | +14j |
| Non-réponse 3x+ | set_remind | +21j |
| RDV confirmé | send_visio | immédiat |

---

## ✅ Format obligatoire

- **Date** : `YYYY-MM-DD` ← pas ISO complet
- **Heure** : `HH:MM` ← pas 24h long
- **Minutes** : 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
- **Array** : Toujours [ ... ]
- **JSON** : Valide et parseable
- **Texte** : Aucun avant ou après

---

## ❌ ERREURS CRITIQUES

```
🚫 "send_date": "2025-11-17T14:35:00"   ← Format unifié (v1)
✅ "send_date": "2025-11-17"             ← Date seule
✅ "send_time": "14:35"                  ← Heure seule

🚫 "remind_time": "14:37"               ← 37 pas multiple de 5
✅ "remind_time": "14:35"               ← 35 multiple de 5

🚫 "action": "set_email"                ← INTERDIT v2
✅ "action": "set_remind"               ← Utiliser à la place

🚫 Pas intéressé → set_email            ← Interdit
✅ Pas intéressé → set_remind +14j      ← Correct
```

---

## 🎯 Décision rapide

```
| Prospect dit...              | → Action       |
|------------------------------|---|
| Envoyez-moi présentation     | send_email      |
| Rappelez-moi demain          | set_remind +1j  |
| RDV confirmé le 20/11 à 15h  | send_visio      |
| Je vais en parler à l'équipe  | set_remind +7j  |
| Pas intéressé pour le moment  | set_remind +14j |
| Pas de réponse (1x)          | set_remind +7j  |
| Pas de réponse (2x)          | set_remind +14j |
| Pas de réponse (3x+)         | set_remind +21j |
```

---

## 📱 Validation n8n

```javascript
// 1 ligne pour vérifier
if (response.includes("set_email")) throw new Error("set_email forbidden");
```

---

## 🔗 Fichiers utiles

| Fichier | Usage |
|---------|-------|
| `prompt_agent_improved.md` | Prompt complet |
| `PROMPT_v2_CHANGELOG.md` | Changements détaillés |
| `PROMPT_v2_TEST_CASES.md` | 5 cas de test |
| `PROMPT_v2_INTEGRATION_GUIDE.md` | Déploiement |
| `PROMPT_IMPROVEMENTS_SUMMARY.md` | Résumé |

---

## 💡 Astuces

1. **Minutes multiples de 5** : Utiliser :00, :05, :10, :15, :20, :25, :30, :35, :40, :45, :50, :55
2. **Pas d'email programmé** : Tout futur doit être set_remind
3. **Toujours Array** : Même pour 1 seule action, retourner [ {...} ]
4. **Dates futures** : Calculer par rapport à {{ $now }}
5. **Pas de samedi/dimanche** : Choisir jours ouvres
6. **Pas lundi matin / vendredi 15:30+** : Préférer matin/midi

---

**Version** : 2.0 Quick Reference
**À jour** : 17 novembre 2025
**GPT Model** : Compatible GPT-5
