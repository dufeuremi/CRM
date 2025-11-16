// Script de test pour insérer des mails d'exemple dans crm_mails
// À exécuter dans la console du navigateur après connexion

async function insertTestMails() {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available');
        return;
    }
    
    const userId = window.currentUserId;
    
    const testMails = [
        // Mail envoyé simple
        {
            sender: 'nparent@taskalys.fr',
            sender_id: userId,
            recipient: 'dupont@entreprise.fr',
            recipient_id: null,
            object: 'Présentation Taskalys - Solutions d\'automatisation',
            html_body: `<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
<p>Bonjour M. Dupont,</p>

<p>Suite à notre échange téléphonique de ce jour, vous trouverez ci-joint notre présentation détaillée des solutions Taskalys.</p>

<p>Nous accompagnons les PME et ETI dans l'identification et l'automatisation de leurs tâches répétitives, permettant à nos clients d'économiser en moyenne <strong>21h par mois et par collaborateur</strong>.</p>

<p>Nos domaines d'intervention :</p>
<ul>
<li>Automatisation des processus administratifs</li>
<li>Interconnexion de vos outils métier</li>
<li>Génération automatique de documents</li>
<li>Optimisation des workflows</li>
</ul>

<p>Seriez-vous disponible pour un échange de 20 minutes en visio afin d'identifier vos besoins spécifiques ?</p>

<div style='padding: 0 20px 30px 20px;'>
<p style='margin-bottom: 10px;'>Vous souhaitant une bonne réception,</p>
<p style='margin-bottom: 25px;'>Très belle journée,</p>
<table cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;'>
<tr>
<td style='vertical-align: top; padding-right: 20px;'>
<img src='https://taskalys.fr/assets/nparent.png' alt='Nolan Parent' width='160' height='160' style='display: block; border-radius: 24px;'>
</td>
<td style='vertical-align: top;'>
<p style='margin: 0; line-height: 1.8; font-size: 14px;'>
<strong style='font-size: 15px;'>Nolan PARENT</strong><br>
<strong style='font-size: 15px;'>Directeur des opérations</strong><br>
TASKALYS<br>
<a href='mailto:nparent@taskalys.fr' style='color: #0078D4; text-decoration: none;'>nparent@taskalys.fr</a><br>
<span style='color: #666;'>07 84 66 20 40</span>
</p>
</td>
</tr>
</table>
</div>
</div>`,
            attachment: JSON.stringify([
                { name: 'presentation_taskalys.pdf', size: 2048576 }
            ]),
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2 heures
            type: 'send',
            category: 'send_email'
        },
        
        // Mail reçu avec réponse
        {
            sender: 'martin@client.fr',
            sender_id: null,
            recipient: 'nparent@taskalys.fr',
            recipient_id: userId,
            object: 'RE: Présentation Taskalys',
            html_body: `<div style='font-family: Arial, sans-serif;'>
<p>Bonjour Nolan,</p>

<p>Merci pour votre présentation, elle est très claire.</p>

<p>Nous sommes effectivement intéressés par l'automatisation de nos processus de facturation qui nous prennent actuellement beaucoup de temps.</p>

<p>Je suis disponible pour une visio <strong>jeudi prochain à 14h30</strong>. Est-ce que cela vous convient ?</p>

<p>Cordialement,</p>
<p><strong>Jean Martin</strong><br>
Directeur Administratif et Financier<br>
Martin & Associés</p>
</div>`,
            attachment: null,
            date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Il y a 1 heure
            type: 'received',
            category: null
        },
        
        // Mail envoyé avec invitation visio
        {
            sender: 'rdufeu@taskalys.fr',
            sender_id: userId,
            recipient: 'bernard@prospect.com',
            recipient_id: null,
            object: 'Confirmation RDV - Appel de découverte Taskalys',
            html_body: `<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
<p>Bonjour M. Bernard,</p>

<p>Suite à notre échange téléphonique, je vous confirme notre rendez-vous en visio le <strong>mardi 12 novembre à 10h00</strong>.</p>

<p>Voici le lien Teams : <a href="https://teams.microsoft.com/l/meetup-join/..." style="color: #0078D4;">Rejoindre la réunion</a></p>

<p>Nous aborderons ensemble :</p>
<ul>
<li>Vos besoins en automatisation</li>
<li>Les processus actuels à optimiser</li>
<li>Une démonstration de nos solutions</li>
</ul>

<p>À très bientôt,</p>

<div style='padding: 0 20px 30px 20px;'>
<p style='margin-bottom: 10px;'>Vous souhaitant une bonne réception,</p>
<p style='margin-bottom: 25px;'>Très belle journée,</p>
<table cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;'>
<tr>
<td style='vertical-align: top; padding-right: 20px;'>
<img src='https://taskalys.fr/assets/nparent.png' alt='Nolan Parent' width='160' height='160' style='display: block; border-radius: 24px;'>
</td>
<td style='vertical-align: top;'>
<p style='margin: 0; line-height: 1.8; font-size: 14px;'>
<strong style='font-size: 15px;'>Rémi DUFEU</strong><br>
<strong style='font-size: 15px;'>Co-fondateur</strong><br>
TASKALYS<br>
<a href='mailto:rdufeu@taskalys.fr' style='color: #0078D4; text-decoration: none;'>rdufeu@taskalys.fr</a><br>
<span style='color: #666;'>06 12 34 56 78</span>
</p>
</td>
</tr>
</table>
</div>
</div>`,
            attachment: null,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
            type: 'send',
            category: 'send_visio'
        },
        
        // Mail reçu ancien
        {
            sender: 'contact@oldclient.fr',
            sender_id: null,
            recipient: 'nparent@taskalys.fr',
            recipient_id: userId,
            object: 'Demande de devis',
            html_body: `<div style='font-family: Arial, sans-serif;'>
<p>Bonjour,</p>

<p>Nous avons entendu parler de vos solutions d'automatisation et souhaiterions obtenir un devis pour notre entreprise.</p>

<p>Nous sommes une PME de 50 personnes dans le secteur de la logistique.</p>

<p>Pouvez-vous nous rappeler pour en discuter ?</p>

<p>Cordialement,</p>
<p><strong>Sophie Durand</strong><br>
Responsable Administrative<br>
LogiTrans Solutions</p>
</div>`,
            attachment: JSON.stringify([
                { name: 'cahier_des_charges.pdf', size: 1024000 },
                { name: 'organigramme.pdf', size: 512000 }
            ]),
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 7 jours
            type: 'received',
            category: null
        },
        
        // Mail envoyé - relance avec catégorie set_remind
        {
            sender: 'nparent@taskalys.fr',
            sender_id: userId,
            recipient: 'legrand@entreprise.com',
            recipient_id: null,
            object: 'Retour d\'expérience - Automatisation pour les PME',
            html_body: `<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
<p>Bonjour M. Legrand,</p>

<p>Suite à notre premier échange, je souhaitais partager avec vous quelques retours d'expérience de nos clients dans votre secteur.</p>

<p><strong>Cas client récent</strong> : Une PME similaire à la vôtre a pu économiser <strong>450 heures de travail par an</strong> en automatisant la création de leurs références produits.</p>

<p>Si votre contexte a évolué et que vous souhaitez explorer comment nous pourrions vous accompagner, n'hésitez pas à me solliciter.</p>

<p>Pas de pression, juste une porte ouverte si le sujet devient d'actualité chez vous.</p>

<div style='padding: 0 20px 30px 20px;'>
<p style='margin-bottom: 10px;'>Vous souhaitant une bonne réception,</p>
<p style='margin-bottom: 25px;'>Très belle journée,</p>
<table cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;'>
<tr>
<td style='vertical-align: top; padding-right: 20px;'>
<img src='https://taskalys.fr/assets/nparent.png' alt='Nolan Parent' width='160' height='160' style='display: block; border-radius: 24px;'>
</td>
<td style='vertical-align: top;'>
<p style='margin: 0; line-height: 1.8; font-size: 14px;'>
<strong style='font-size: 15px;'>Nolan PARENT</strong><br>
<strong style='font-size: 15px;'>Directeur des opérations</strong><br>
TASKALYS<br>
<a href='mailto:nparent@taskalys.fr' style='color: #0078D4; text-decoration: none;'>nparent@taskalys.fr</a><br>
<span style='color: #666;'>07 84 66 20 40</span>
</p>
</td>
</tr>
</table>
</div>
</div>`,
            attachment: JSON.stringify([
                { name: 'cas_client_industrie.pdf', size: 768000 }
            ]),
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 14 jours
            type: 'send',
            category: 'set_remind'
        },
        
        // Mail envoyé - email planifié
        {
            sender: 'nparent@taskalys.fr',
            sender_id: userId,
            recipient: 'durand@newlead.fr',
            recipient_id: null,
            object: 'Présentation - Solutions d\'automatisation Taskalys',
            html_body: `<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
<p>Bonjour M. Durand,</p>

<p>J'espère que ce message vous trouve en bonne santé.</p>

<p>Taskalys accompagne les entreprises comme la vôtre dans l'optimisation de leurs processus métier grâce à l'automatisation.</p>

<p>Nos clients témoignent en moyenne de <strong>21 heures économisées par mois et par collaborateur</strong>.</p>

<p>Seriez-vous ouvert à un échange de 20 minutes pour explorer comment nous pourrions vous accompagner ?</p>

<div style='padding: 0 20px 30px 20px;'>
<p style='margin-bottom: 10px;'>Vous souhaitant une bonne réception,</p>
<p style='margin-bottom: 25px;'>Très belle journée,</p>
<table cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;'>
<tr>
<td style='vertical-align: top; padding-right: 20px;'>
<img src='https://taskalys.fr/assets/nparent.png' alt='Nolan Parent' width='160' height='160' style='display: block; border-radius: 24px;'>
</td>
<td style='vertical-align: top;'>
<p style='margin: 0; line-height: 1.8; font-size: 14px;'>
<strong style='font-size: 15px;'>Nolan PARENT</strong><br>
<strong style='font-size: 15px;'>Directeur des opérations</strong><br>
TASKALYS<br>
<a href='mailto:nparent@taskalys.fr' style='color: #0078D4; text-decoration: none;'>nparent@taskalys.fr</a><br>
<span style='color: #666;'>07 84 66 20 40</span>
</p>
</td>
</tr>
</table>
</div>
</div>`,
            attachment: null,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
            type: 'send',
            category: 'set_email'
        }
    ];
    
    console.log('Insertion de', testMails.length, 'mails de test...');
    
    const { data, error } = await window.supabaseClient
        .from('crm_mails')
        .insert(testMails)
        .select();
    
    if (error) {
        console.error('Erreur lors de l\'insertion:', error);
        return;
    }
    
    console.log('✅ Mails insérés avec succès:', data.length);
    console.log('Données insérées:', data);
    
    // Recharger la liste des mails
    if (typeof loadMails === 'function') {
        await loadMails();
        console.log('✅ Liste des mails rechargée');
    }
}

// Fonction pour nettoyer les mails de test
async function deleteAllTestMails() {
    if (!window.supabaseClient || !window.currentUserId) {
        console.error('Supabase client or user ID not available');
        return;
    }
    
    const userId = window.currentUserId;
    
    const { data, error } = await window.supabaseClient
        .from('crm_mails')
        .delete()
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .select();
    
    if (error) {
        console.error('Erreur lors de la suppression:', error);
        return;
    }
    
    console.log('✅ Mails supprimés:', data.length);
    
    // Recharger la liste des mails
    if (typeof loadMails === 'function') {
        await loadMails();
        console.log('✅ Liste des mails rechargée');
    }
}

// Instructions d'utilisation
console.log(`
========================================
  SCRIPT DE TEST - MAILS
========================================

Pour insérer des mails de test:
  insertTestMails()

Pour supprimer tous vos mails:
  deleteAllTestMails()

Note: Assurez-vous d'être connecté et sur la page dashboard.html
========================================
`);
