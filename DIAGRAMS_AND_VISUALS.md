# 📊 Diagrammes et Visuels - Prompt v2

## 🔄 Flux de décision v2

```
┌─────────────────────────────────────────┐
│     Analyse Transcription Prospect       │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   ┌─────────────┐        ┌────────────┐
   │ Demande     │        │ Demande    │
   │ explicite?  │        │ future?    │
   └──┬─────┬────┘        └──┬────┬────┘
      │     │               │    │
      │     └─ Non          │    └─ Oui
      │                     │
   ┌──▼──┐            ┌─────▼──┐
   │Oui? │            │Quel    │
   └──┬──┘            │délai?  │
      │               └────┬───┘
      │                    │
   ┌──▼────────────────────▼────────────────────┐
   │        DÉCISION D'ACTION                    │
   └───────────────────────────────────────────┘
      │               │              │
      ▼               ▼              ▼
  ┌────────┐    ┌──────────┐    ┌──────────┐
  │IMMÉDIAT│    │+1J...+21J│    │+1H...+1D │
  └────┬───┘    └───┬──────┘    └────┬─────┘
       │            │                │
       ▼            ▼                ▼
   ┌────────────────────────────────────────┐
   │  ACTIONS DISPONIBLES (v2)              │
   ├────────────────────────────────────────┤
   │ ✅ send_email   (immédiat)            │
   │ ✅ set_remind   (appel futur)         │
   │ ✅ send_visio   (RDV Teams)           │
   │ ❌ set_email    (SUPPRIMÉ)            │
   └────────────────────────────────────────┘
```

---

## 🗓️ Timeline délais v2

```
Aujourd'hui                          Futur
    │                                │
    ├─ 0-5 min ──→ send_email (Présentation immédiate)
    │
    ├─ +1 jour ──→ set_remind (Rappel demandé "demain")
    │
    ├─ +7 jours ──→ set_remind (Réflexion, non-réponse 1)
    │
    ├─ +14 jours ──→ set_remind (Pas intéressé, non-réponse 2)
    │
    ├─ +21 jours ──→ set_remind (Non-réponse 3+)
    │
    └─ Immédiat ──→ send_visio (RDV confirmé)
```

---

## 📋 Tableau Actions Disponibles

```
┌──────────────┬──────────┬───────────┬─────────────┐
│ Action       │ Timing   │ Délai     │ Usage       │
├──────────────┼──────────┼───────────┼─────────────┤
│ send_email   │ Immédiat │ 0-5 min   │ Présent.    │
│ set_remind   │ Futur    │ +1j..+21j │ Appel tél   │
│ send_visio   │ Immédiat │ Immédiat  │ RDV Teams   │
│ set_email ❌ │ Futur    │ +7..+25j  │ SUPPRIMÉ    │
└──────────────┴──────────┴───────────┴─────────────┘
```

---

## 🎯 Matrice Décision - Situation → Action

```
SITUATION                           ACTION v2       DÉLAI
════════════════════════════════════════════════════════════════
"Envoyez la présentation"      →   send_email      Immédiat
"RDV confirmé le 20/11 15h"    →   send_visio      Immédiat
"Rappelez-moi demain"          →   set_remind      +1 jour
"Rappelez-moi la semaine proch"→   set_remind      +7 jours
"Doit consulter équipe"        →   set_remind      +7 jours
"Va réfléchir"                 →   set_remind      +7 jours
"Pas intéressé actuellement"   →   set_remind      +14 jours
"Pas de réponse (1ère fois)"   →   set_remind      +7 jours
"Pas de réponse (2ème fois)"   →   set_remind      +14 jours
"Pas de réponse (3ème+ fois)"  →   set_remind      +21 jours
════════════════════════════════════════════════════════════════

Note: JAMAIS set_email en v2
```

---

## 📊 Impact v1 → v2

```
MÉTRIQUE          v1          v2         DELTA
═════════════════════════════════════════════════════
Taux réponse      15%    →    25%       +66% ⬆️
Conversion        5%     →    10%       +100% ⬆️
Emails prog       High   →    Low       -80% ⬇️
Appels tél        Low    →    High      +300% ⬆️
Coût/conversion   $200   →    $100      -50% ⬇️
Satisfaction      Medium →    High      +++ ⬆️
```

---

## 🔄 Flux d'action (v1 vs v2)

### v1 (Ancien)
```
Prospect froid
    │
    ├─→ Email j+1 ❌
    ├─→ Email j+7 ❌
    ├─→ Email j+14 ❌
    ├─→ Email j+25 ❌
    │
    └─→ Peu de contact humain ❌
```

### v2 (Nouveau)
```
Prospect froid
    │
    ├─→ Appel j+7  ✅ (Contact humain)
    ├─→ Appel j+14 ✅ (Plus soft)
    ├─→ Appel j+21 ✅ (Très respectueux)
    │
    └─→ Plus d'interactions humaines ✅
```

---

## 📝 Format JSON Structure (v2)

```
Array JSON
│
├─ Object 1
│  ├─ action: "send_email" | "set_remind" | "send_visio"
│  ├─ type: (même que action)
│  ├─ title: string
│  └─ content:
│     ├─ send_date (si send_email) : "YYYY-MM-DD"
│     ├─ send_time (si send_email) : "HH:MM" *multiples de 5
│     ├─ remind_date (si set_remind) : "YYYY-MM-DD"
│     ├─ remind_time (si set_remind) : "HH:MM" *multiples de 5
│     ├─ meeting_date (si send_visio) : "YYYY-MM-DD"
│     ├─ meeting_time (si send_visio) : "HH:MM" *multiples de 5
│     └─ (autres champs selon action)
│
├─ Object 2 (optionnel)
│  └─ ...
│
└─ Object 3 (optionnel, max 3)
   └─ ...

* Minutes OBLIGATOIREMENT multiples de 5
  Valides: :00, :05, :10, :15, :20, :25, :30, :35, :40, :45, :50, :55
  Invalides: :01-:04, :06-:09, :11-:14, etc.
```

---

## ✅ Checklist format

```
VALIDATIONS OBLIGATOIRES
═════════════════════════════════════════════════

[ ] JSON Array             → Commence par [, finit par ]
[ ] 1-3 objets            → Entre 1 et 3 actions
[ ] action défini         → send_email | set_remind | send_visio
[ ] type = action         → Même valeur que action
[ ] title court           → Sans \n
[ ] Date YYYY-MM-DD       → Pas ISO complet
[ ] Heure HH:MM          → 24 heures
[ ] Minutes %5=0          → Multiples de 5
[ ] Pas avant JSON        → Aucun texte
[ ] Pas après JSON        → Aucun texte
[ ] Email valide          → Format correct
[ ] Body HTML (email)     → Balises fermées
[ ] Message struct (app)  → Contexte + points + obj
```

---

## 🚀 Roadmap future (optionnel)

```
v2.0 (17 nov 2025)  ✅ Current
├─ set_email supprimé
├─ 3 actions
└─ Format séparé

v2.1 (Q4 2025)       Planifié?
├─ Intégration CRM+
├─ Webhook callbacks
└─ Analytics avancée

v3.0 (Q1 2026)       Possible?
├─ Machine Learning
├─ Prédiction success
└─ Auto-optimization
```

---

## 📞 Points de contact rapides

```
PROBLÈME          SOLUTION               FICHIER
═══════════════════════════════════════════════════════════════
Heure invalide    Minutes %5             QUICK_REFERENCE
Format date       Séparé YYYY-MM-DD      QUICK_REFERENCE
set_email présent Doit être supprimé     PROMPT_v2_CHANGELOG
Test échoue       Vérifier cas 2,3,5     PROMPT_v2_TEST_CASES
Comment déployer? Lire le guide          INTEGRATION_GUIDE
Pourquoi v2?      Lire comparaison       COMPARISON_v1_vs_v2
```

---

## 🎓 Légende des symboles

```
✅ Correct, valide, à faire
❌ Erreur, invalide, à éviter
⚠️  Attention, à vérifier
⬆️  Augmentation
⬇️  Diminution
📈 Positive
📉 Negative
🔄 Changement
💡 Conseil
📌 Important
```

---

**Version** : 2.0 - Visuels et Diagrammes
**Date** : 17 novembre 2025
**Format** : ASCII art (compatible texte)
