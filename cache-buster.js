/**
 * Cache Buster - Système de gestion de version automatique pour CSS et JS
 *
 * Ce module permet de forcer le rechargement des fichiers statiques en ajoutant
 * automatiquement un paramètre de version unique aux URLs des fichiers CSS et JS.
 */

const CacheBuster = {
    /**
     * Configuration
     */
    config: {
        // Version basée sur le timestamp du déploiement
        version: Date.now(),

        // Ou utilisez une version fixe que vous pouvez incrémenter manuellement
        // version: '2.0.1',

        // Fichiers à versionner (patterns)
        patterns: {
            css: /\.css(\?.*)?$/,
            js: /\.js(\?.*)?$/
        }
    },

    /**
     * Initialise le cache buster au chargement de la page
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.versionAllAssets());
        } else {
            this.versionAllAssets();
        }
    },

    /**
     * Versionne tous les assets CSS et JS de la page
     */
    versionAllAssets() {
        this.versionStylesheets();
        this.versionScripts();
        console.log(`🔄 Cache Buster activé - Version: ${this.config.version}`);
    },

    /**
     * Ajoute la version aux fichiers CSS
     */
    versionStylesheets() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && this.isLocalFile(href) && this.config.patterns.css.test(href)) {
                link.href = this.addVersion(href);
            }
        });
    },

    /**
     * Ajoute la version aux fichiers JS
     */
    versionScripts() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && this.isLocalFile(src) && this.config.patterns.js.test(src)) {
                script.src = this.addVersion(src);
            }
        });
    },

    /**
     * Vérifie si le fichier est local (pas une CDN externe)
     */
    isLocalFile(url) {
        // Exclure les URLs absolues (CDN)
        return !url.startsWith('http://') &&
               !url.startsWith('https://') &&
               !url.startsWith('//');
    },

    /**
     * Ajoute le paramètre de version à une URL
     */
    addVersion(url) {
        // Supprimer l'ancienne version si elle existe
        url = url.replace(/[?&]v=[^&]+/, '');

        // Ajouter la nouvelle version
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${this.config.version}`;
    },

    /**
     * Fonction helper pour charger dynamiquement un CSS avec version
     */
    loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = this.addVersion(href);
        document.head.appendChild(link);
        return link;
    },

    /**
     * Fonction helper pour charger dynamiquement un JS avec version
     */
    loadJS(src, async = true) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = this.addVersion(src);
            script.async = async;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    },

    /**
     * Force le rechargement d'un fichier CSS spécifique
     */
    reloadCSS(href) {
        const links = document.querySelectorAll(`link[href*="${href}"]`);
        links.forEach(link => {
            const newHref = this.addVersion(href);
            link.href = newHref;
        });
    },

    /**
     * Met à jour la version et recharge tous les assets
     */
    updateVersion(newVersion = null) {
        this.config.version = newVersion || Date.now();
        this.versionAllAssets();
        console.log(`✅ Version mise à jour: ${this.config.version}`);
    }
};

/**
 * Fonction d'initialisation automatique
 * Décommentez cette ligne pour activer le cache buster automatiquement
 */
// CacheBuster.init();

/**
 * Export pour utilisation en tant que module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheBuster;
}
