#!/usr/bin/env node

/**
 * Script pour mettre à jour automatiquement la version du Cache Buster
 * dans tous les fichiers HTML
 *
 * Usage:
 *   node update-version.js 2.0.0
 *   node update-version.js timestamp
 */

const fs = require('fs');
const path = require('path');

// Configuration
const HTML_FILES = [
    'index.html',
    'login.html',
    'dashboard.html',
    'analytics.html',
    'test-cache-buster.html'
];

const VERSION_PATTERN = /CacheBuster\.config\.version\s*=\s*['"]([^'"]+)['"]/;

// Obtenir la nouvelle version depuis les arguments
const args = process.argv.slice(2);
let newVersion;

if (args.length === 0) {
    console.error('❌ Usage: node update-version.js <version> ou node update-version.js timestamp');
    process.exit(1);
}

if (args[0] === 'timestamp') {
    newVersion = Date.now().toString();
    console.log(`📅 Utilisation du timestamp: ${newVersion}`);
} else {
    newVersion = args[0];
    console.log(`🔢 Nouvelle version: ${newVersion}`);
}

// Mettre à jour tous les fichiers HTML
let updatedCount = 0;
let errorCount = 0;

console.log('\n🔄 Mise à jour des fichiers...\n');

HTML_FILES.forEach(filename => {
    const filePath = path.join(__dirname, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} - Fichier non trouvé, ignoré`);
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Vérifier si le fichier contient le Cache Buster
        if (!content.includes('CacheBuster.config.version')) {
            console.log(`⏭️  ${filename} - Pas de Cache Buster, ignoré`);
            return;
        }

        // Remplacer la version
        const oldContent = content;
        content = content.replace(
            VERSION_PATTERN,
            `CacheBuster.config.version = '${newVersion}'`
        );

        // Vérifier si le remplacement a eu lieu
        if (content === oldContent) {
            console.log(`⚠️  ${filename} - Aucun changement détecté`);
            return;
        }

        // Sauvegarder le fichier
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${filename} - Mis à jour avec succès`);
        updatedCount++;

    } catch (error) {
        console.error(`❌ ${filename} - Erreur: ${error.message}`);
        errorCount++;
    }
});

// Résumé
console.log('\n' + '='.repeat(50));
console.log(`📊 Résumé:`);
console.log(`   ✅ Fichiers mis à jour: ${updatedCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`   🔢 Nouvelle version: ${newVersion}`);
console.log('='.repeat(50) + '\n');

if (updatedCount > 0) {
    console.log('🎉 Mise à jour terminée avec succès !');
    console.log('💡 N\'oubliez pas de tester votre application.');
} else {
    console.log('⚠️  Aucun fichier n\'a été mis à jour.');
}
