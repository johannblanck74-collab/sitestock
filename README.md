# 🏗️ SiteStock — Gestion de Matériel Chantier

Application web de suivi de matériel entre chantiers et dépôt. Multi-utilisateurs, avec photos, historique des mouvements et journal d'audit. Fonctionne sur PC, tablette et téléphone.

[!\[Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/johannblanck74-collab/sitestock)

\---

## ✨ Fonctionnalités

* ✅ **Suivi matériel** : localisation (chantier / dépôt), photos, notes
* ✅ **Historique des mouvements** par item avec dates et utilisateurs
* ✅ **Alertes** : matériel au dépôt depuis plus de 3 mois
* ✅ **Multi-utilisateurs** avec rôles (collaborateur / admin)
* ✅ **Journal d'audit** complet des modifications (admin)
* ✅ **Export JSON** des données
* ✅ **Synchronisation temps réel** entre tous les appareils
* ✅ **Photos compressées** automatiquement

\---

## 🚀 Déploiement

### Option 1 — Un clic (recommandé)

Cliquez sur le bouton **Deploy to Netlify** ci-dessus.

### Option 2 — Manuel

1. Clonez ce dépôt
2. Sur [app.netlify.com](https://app.netlify.com), créez un nouveau site
3. Glissez le dossier du projet dans la zone de déploiement

\---

## ⚙️ Configuration

### 1\. Variables d'environnement (Netlify → Site configuration → Environment variables)

|Variable|Description|Exemple|
|-|-|-|
|`APP\\\_PASSWORD`|Mot de passe collaborateurs|`equipe2024`|
|`ADMIN\\\_PASSWORD`|Mot de passe admin (création/suppression)|`admin-secret`|

> Si aucun mot de passe n'est défini, l'accès est libre (non recommandé en production).

### 2\. Personnalisation de l'interface

Ouvrez `index.html` et modifiez le bloc `CONFIG` en haut du script :

```javascript
const CONFIG = {
  appName:         'Gestion du Matériel',  // Titre de l'application
  companyName:     'Votre Entreprise',     // Nom de votre entreprise
  itemLabel:       'matériel',             // Ex: 'interstock', 'équipement'
  itemLabelPlural: 'matériels',
  site1Label:      'Sur chantier',         // Libellé localisation 1
  site2Label:      'Au dépôt',             // Libellé localisation 2
  numberPrefix:    'IT-',                  // Préfixe des numéros
};
```

\---

## 🏗️ Architecture

```
sitestock/
├── index.html                        # Application frontend
└── netlify/
    └── functions/
        ├── data.mjs                  # API données (GET/POST/DELETE)
        └── log.mjs                   # API journal d'audit (admin)
```

* **Frontend** : HTML/CSS/JS pur, aucune dépendance
* **Backend** : Netlify Functions + Netlify Blobs
* **Auth** : variables d'environnement Netlify (jamais dans le code)

\---

## 📄 Licence

MIT — libre d'utilisation, modification et distribution.

