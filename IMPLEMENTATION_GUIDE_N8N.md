# 🚀 Implementation Guide: Email Structure in n8n/Make.com

> **For Developers** : Guide complet pour implémenter la nouvelle structure d'email dans vos workflows.

---

## 📐 Architecture Email

### Flux Standard

```
Transcription de l'appel
         ↓
[Analyse par GPT-5]
         ↓
Action Detectée: send_email?
         ↓
         YES
         ↓
[Structure Générée par 5 étapes]
         ↓
[Templating HTML]
         ↓
[Injection Variables n8n]
         ↓
[Envoi Email]
```

---

## 💻 Implémentation n8n

### Node 1: Analyse Transcription

```javascript
// Prompt pour GPT-5
const systemPrompt = `
Tu es un agent d'analyse d'appels pour Taskalys.

Analyse la transcription et retourne UNIQUEMENT un JSON valide avec:
{
  "action": "send_email" | "set_remind" | "send_visio",
  "temperature": 1-5,
  "needs_example": true|false,
  "suggested_case": "régie_pub" | "industriel" | "editeur_soft"
}

Respecte les règles de délai.
`;
```

### Node 2: Build Email Structure

```javascript
// Fonction pour construire les 5 étapes
function buildEmailStructure(prospect, user, analysis) {
  const step1 = buildThankYouStep(prospect, analysis);
  const step2 = buildServicesStep();
  const step3 = buildCaseStudyStep(analysis.suggested_case);
  const step4 = buildPricingStep();
  const step5 = buildCTAStep(analysis);
  
  return {
    step1,
    step2,
    step3,
    step4,
    step5,
    full_body: [step1, step2, step3, step4, step5].join("\n\n")
  };
}

// Étape 1: Remerciement
function buildThankYouStep(prospect, analysis) {
  if (analysis.first_contact) {
    return `Merci pour ce premier contact. J'ai bien noté votre intérêt pour ${analysis.topic}.`;
  } else {
    return `Merci pour cet échange enrichissant. Comme convenu, vous trouverez ci-joint notre présentation détaillée.`;
  }
}

// Étape 2: Services
function buildServicesStep() {
  return `Comme évoqué, nous sommes une agence spécialisée dans la conduite de changement opérationnel. Nous intervenons auprès de nos clients PME et ETI dans la transformation de leurs processus afin de revaloriser le temps des collaborateurs.`;
}

// Étape 3: Cas d'usage chiffré
function buildCaseStudyStep(case_type) {
  const cases = {
    régie_pub: {
      title: "Régie Publicitaire",
      description: "génération automatique de 1 600 PowerPoint, envoi de mailings de prospection automatisés, enregistrement et transcription des appels, réalisation de comptes rendus automatiques, envoi d'invitations Teams",
      result: "environ 21 heures par mois et par collaborateur gagnées"
    },
    industriel: {
      title: "Industriel",
      description: "création automatique de références produits dans la base de données",
      result: "environ 450 heures par an économisées"
    },
    editeur_soft: {
      title: "Éditeur de Logiciel (Sales)",
      description: "optimisation des tâches administratives pour l'équipe Sales",
      result: "augmentation de 25% du volume d'appels et meilleure qualification"
    }
  };
  
  const selectedCase = cases[case_type] || cases.régie_pub;
  
  return `Pour vous donner un exemple concret, nous avons accompagné ${selectedCase.title} dans l'automatisation : ${selectedCase.description}. Résultat : ${selectedCase.result}, permettant la réattribution des tâches vers des missions à plus haute valeur ajoutée.`;
}

// Étape 4: Tarification
function buildPricingStep() {
  return `Notre tarification pour ce type de gain est de l'ordre de 300 à 1 200€ par mois selon vos besoins spécifiques.`;
}

// Étape 5: CTA
function buildCTAStep(analysis) {
  const ctas = {
    ask_call: "Seriez-vous disponible pour 10 minutes d'échange téléphonique cette semaine afin de vous présenter cet outil ?",
    no_pressure: "N'hésitez pas si vous avez des questions sur la présentation ou si vous souhaitez en discuter davantage.",
    follow_up: "Je reviens vers vous demain pour affiner les détails."
  };
  
  return ctas[analysis.cta_type] || ctas.no_pressure;
}
```

### Node 3: Déterminer Salutation

```javascript
// Déterminer Madame/Monsieur/Prénom selon genre du prénom
function determineSalutation(firstName, lastNameUsage = 'formal') {
  const femaleNames = [
    'Anne', 'Marie', 'Sophie', 'Catherine', 'Véronique', 'Isabelle', 
    'Christine', 'Nathalie', 'Sylvie', 'Martine', 'Francine', 'Martine'
  ];
  
  const maleNames = [
    'Pierre', 'Jean', 'Michel', 'Paul', 'André', 'Philippe', 
    'François', 'Marc', 'David', 'Christian', 'Robert'
  ];
  
  if (femaleNames.some(name => firstName.toLowerCase().startsWith(name.toLowerCase()))) {
    return `Bonjour Madame ${lastNameUsage},`;
  } else if (maleNames.some(name => firstName.toLowerCase().startsWith(name.toLowerCase()))) {
    return `Bonjour Monsieur ${lastNameUsage},`;
  } else {
    return `Bonjour ${lastNameUsage},`;
  }
}

// Utilisation
const salutation = determineSalutation(prospect.first_name, prospect.last_name);
```

### Node 4: Build HTML Body

```javascript
// Template HTML avec injection variables
function buildEmailHTML(emailStructure, prospect, user, salutation) {
  const htmlTemplate = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <p>${salutation}</p>
  
  <p>${emailStructure.step1}</p>
  
  <p>${emailStructure.step2}</p>
  
  <p>${emailStructure.step3}</p>
  
  <p>${emailStructure.step4}</p>
  
  <p>${emailStructure.step5}</p>
  
  <p>Bien à vous,</p>
  
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
    <tr>
      <td style="vertical-align: top; padding-right: 20px;">
        <img src="${user.avatar_url}" alt="${user.first_name} ${user.last_name}" width="160" height="160" style="display: block; border-radius: 32px; border: 1px solid #333333;">
      </td>
      <td style="vertical-align: top;">
        <p style="margin: 0; line-height: 1.8; font-size: 14px;">
          <strong style="font-size: 15px;">${user.first_name} ${user.last_name}</strong><br>
          <strong style="font-size: 15px;">Business Developper</strong><br>
          TASKALYS<br>
          <a href="mailto:${user.email}" style="color: #0078D4; text-decoration: none;">${user.email}</a><br>
          <span style="color: #666;">+33 ${user.phone}</span>
        </p>
      </td>
    </tr>
  </table>
</div>
  `;
  
  return htmlTemplate;
}
```

### Node 5: Generate JSON Output

```javascript
// Générer le JSON final conforme au schéma
function generateSendEmailJSON(prospect, user, emailData, currentDate) {
  
  // Calculer send_date et send_time
  const now = new Date(currentDate);
  const sendDateTime = new Date(now.getTime() + 5 * 60000); // +5 minutes
  
  // Formater les dates
  const sendDate = sendDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
  const hours = String(sendDateTime.getHours()).padStart(2, '0');
  const minutes = Math.round(sendDateTime.getMinutes() / 5) * 5; // Arrondir à 5 minutes
  const sendTime = `${hours}:${String(minutes).padStart(2, '0')}`; // HH:MM
  
  const jsonOutput = {
    action: "send_email",
    type: "send_email",
    title: `Email ${emailData.context} - ${prospect.first_name} ${prospect.last_name}`,
    content: {
      send_date: sendDate,
      send_time: sendTime,
      subject: emailData.subject,
      body: emailData.html_body,
      recipient: prospect.email
    }
  };
  
  return jsonOutput;
}
```

---

## 🔧 Configuration Make.com

### Webhook + GPT-5 Module

1. **Trigger** : Webhook reçoit transcription
2. **Module 1** : Format transcription
3. **Module 2** : Appel GPT-5 avec prompt système
4. **Module 3** : Parse réponse JSON
5. **Module 4** : Construit 5 étapes
6. **Module 5** : Génère HTML avec variables
7. **Module 6** : Crée JSON send_email
8. **Module 7** : Envoie vers base de données/CRM

### Exemple Itérateur (pour multiple actions)

```
[
  {
    "action": "send_email",
    "type": "send_email",
    "title": "Email Prospection - Jean Dupont",
    "content": {
      "send_date": "2025-11-18",
      "send_time": "10:00",
      "subject": "Gagnez 29h/mois par collaborateur",
      "body": "<div>...</div>",
      "recipient": "jean.dupont@company.com"
    }
  }
]
```

---

## 📊 Cas d'Utilisation n8n

### Scenario 1: Prospection Immédiate

```
Transcription: "Envoyez-moi votre présentation"
     ↓
[Analyse] → action: send_email, step3: régie_pub
     ↓
[5 étapes] → Génération complète
     ↓
[HTML] → Avec salutation + signature
     ↓
[JSON] → send_date: maintenant +5min, send_time: arrondi 5min
     ↓
[Webhook] → Vers API Supabase
```

### Scenario 2: Relance +14 jours

```
Transcription: "Pas intéressé pour le moment"
     ↓
[Analyse] → action: set_remind, délai: +14j
     ↓
[Calcul] → Date = today + 14 days, time: 10:00
     ↓
[JSON] → set_remind avec message structuré
     ↓
[Webhook] → Vers planning/CRM
```

---

## 🎯 Variables Critiques

### Date/Heure (Obligatoire)
```javascript
// JAMAIS d'heure arbitraire
const minutes = 0; // TOUJOURS multiple de 5: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55

// Arrondir correctement
const roundTo5 = (minutes) => Math.round(minutes / 5) * 5;
```

### Format de Date
```javascript
// ✅ BON
"send_date": "2025-11-18"
"send_time": "14:30"

// ❌ MAUVAIS
"send_date": "18/11/2025"  // Format français
"send_time": "14:37"       // Pas multiple de 5
```

### HTML Encoding
```javascript
// Apostrophes
const text = "l'outil";  // ✅ Correct
const text = "l\'outil"; // ✅ Aussi correct

// Caractères spéciaux
const text = "PME/ETI"; // ✅ OK
const text = "PME&ETI";  // ✅ OK (pas besoin d'encoder &)
```

---

## 🧪 Tests

### Test 1: Structure Email Complète

```javascript
const test = {
  input: {
    prospect: { first_name: "Jean", last_name: "Dupont" },
    user: { ... },
    analysis: { suggested_case: "régie_pub" }
  },
  expected: {
    step1: /Merci|Bonjour/,
    step2: /agence spécialisée/,
    step3: /régie publicitaire.*21h/,
    step4: /300.*1200€/,
    step5: /N'hésitez pas|disponible/
  }
};
```

### Test 2: Format Date/Heure

```javascript
const testDate = "2025-11-18T14:47:00";
const expected = {
  send_date: "2025-11-18",
  send_time: "14:45"  // Arrondi à multiple de 5
};
```

### Test 3: Salutation Correcte

```javascript
const tests = [
  { firstName: "Sophie", expected: "Bonjour Madame" },
  { firstName: "Pierre", expected: "Bonjour Monsieur" },
  { firstName: "Claude", expected: "Bonjour" }
];
```

---

## 📋 Checklist Implémentation

- [ ] Prompt GPT-5 inclut les 5 étapes
- [ ] Fonction `buildEmailStructure` implémentée
- [ ] Salutation détectée correctement
- [ ] HTML template inclus avec variables
- [ ] Dates toujours futures
- [ ] Minutes multiples de 5
- [ ] JSON valide avant envoi
- [ ] Signature HTML incluse
- [ ] Test sur cas réel exécuté
- [ ] Webhook fonctionne

---

## 🔗 Intégrations

### Supabase / Postgres
```sql
INSERT INTO emails_sent (prospect_id, action, content, sent_at)
VALUES ($1, 'send_email', $2::jsonb, NOW());
```

### CRM (Pipedrive, HubSpot)
```javascript
// Push événement email
crm.createActivity({
  deal_id: prospect.deal_id,
  type: "email",
  subject: jsonOutput.content.subject,
  timestamp: new Date()
});
```

### Slack Notification
```javascript
// Alerte envoi
slack.sendMessage({
  channel: "#sales",
  text: `Email envoyé à ${prospect.first_name} ${prospect.last_name}`
});
```

---

## 📚 Ressources

- Prompt principal : `prompt_agent_improved.md`
- Templates : `EMAIL_TEMPLATES_REFERENCE.md`
- Validation : `EMAIL_STRUCTURE_VALIDATION.md`
- Test cases : `PROMPT_v2_TEST_CASES.md`
