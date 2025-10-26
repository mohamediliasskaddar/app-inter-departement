# ConnectOps — Plateforme d’automatisation et de coordination inter-départements

**Résumé**
ConnectOps est une plateforme interne destinée à automatiser et fluidifier la communication, la planification et la coordination entre départements (RH,  Maintenance, Qualité, HSEEn, IT, ...). L’objectif est de réduire les silos, améliorer la productivité, assurer la traçabilité des actions et fournir des tableaux de bord opérationnels.

---

## 1 — Objectifs produit

* Centraliser l’information partagée entre départements.
* Faciliter la planification (visites, audits, réunions) et la gestion d’événements.
* Automatiser rappels, alertes, envoi de rapports.
* Favoriser la collaboration (publications, réclamations, assignations).
* Offrir des tableaux dynamiques et visualisations (OEE, stocks, présence…).
* Assurer une gestion fine des droits (rôles et périmètres par département).

---

## 2 — Fonctionnalités clés (par domaine)

* **Authentification & rôles** : JWT, rôles `Admin | Cadre | Agent | User | Pending`.
* **Publications** : création, types (réclamation/demande/incident/audit/info), pièces jointes, statut, responsable.
* **Messages / Annonces** : messages programmés (dateDebut/dateFin) et intégration calendrier.
* **Tableaux dynamiques** : colonnes typées, lignes, valeurs, création *one-shot* (colonnes+lignes en une requête), édition cellulaire et export.
* **Notifications** : envoi et lecture d’alertes contextualisées (nouvelle publication, tâche assignée…).
* **Tâches / Assignations** : assigner des responsabilités, suivre l’état.
* **Calendrier** : vue globale / départementale des événements planifiés.
* **Gestion utilisateurs & départements** : validation d’inscription, attribution des rôles, périmètres.
* **Personnalisation** : contenu filtré / adapté par département et rôle.

---

## 3 — Architecture & stack technique

* **Backend** : Node.js + Express, architecture REST (controllers / routes / middlewares).
* **Base de données** : MongoDB (Mongoose) — schémas documentaires adaptés aux tableaux dynamiques.
* **Frontend** : Angular (standalone components) + Angular Material (UI) — composants réutilisables : composer, table-editor, preview-card, file-uploader.
* **Authentification** : JWT (tokens), middleware `auth` et `authorize` pour contrôle d’accès.
* **Stockage fichiers** : endpoint d’upload, adaptation vers Google Cloud Storage (signed URLs) en production.


---

## 4 — Structure de l'application : frontend & backend 

**Root Path:** `c:\Users\imk\Desktop\all apps\web\app-inter-departement\backend`

```
├── 📁 public
│   └── 📁 uploads
├── 📁 src
│   ├── 📁 controllers
│   ├── 📁 middlewares
│   │   ├── 📄 auth.js
│   │   └── 📄 authorize.js
│   ├── 📁 models
│   │   ├── 📄 Colonne.js
│   │   ├── 📄 Departement.js
│   │   ├── 📄 Ligne.js
│   │   ├── 📄 Message.js
│   │   ├── 📄 Notification.js
│   │   ├── 📄 Publication.js
│   │   ├── 📄 Tableau.js
│   │   ├── 📄 User.js
│   │   └── 📄 ValeurCellule.js
│   ├── 📁 routes
│   │   ├── 📄 ColonneRoute.js
│   │   ├── 📄 LigneRoute.js
│   │   ├── 📄 MessageRoute.js
│   │   ├── 📄 NotificationRoute.js
│   │   ├── 📄 PublicationRoute.js
│   │   ├── 📄 UserRoute.js
│   │   ├── 📄 ValeurCelluleRoute.js
│   │   ├── 📄 authRoute.js
│   │   └── 📄 tableauRoute.js
│   ├── 📁 utils
│   │   └── 📄 mongoUtils.js
│   ├── 📄 app.js
│   └── 📄 www
└── 📄 server.js
```
**Root Path:** `c:\Users\imk\Desktop\all apps\web\app-inter-departement\frontend`

```
├── 📁 .angular
├── 📁 public
│   ├── 📁 assets
│   ├── 📁 avatars
│   └── ..
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 components
│   │   │   ├── 📁 composer
│   │   │   │   ├── 📁 message-composer
│   │   │   │   ├── 📁 publication-composer
│   │   │   │   └── 📁 tableau-composer
│   │   │   ├── 📁 pages
│   │   │   │   ├── 📁 dashboard
│   │   │   │   ├── 📁 deps
│   │   │   │   │   ├── 📁 HSEEn
│   │   │   │   │   ├── 📁 IT
│   │   │   │   │   ├── 📁 Maintenance
│   │   │   │   │   ├── 📁 Qualite
│   │   │   │   │   └── 📁 RH
│   │   │   │   ├── 📁 login
│   │   │   │   ├── 📁 mini-calendar
│   │   │   │   ├── 📁 notification
│   │   │   │   ├── 📁 publications
│   │   │   │   ├── 📁 register
│   │   │   │   ├── 📁 tableaux
│   │   │   │   └── 📁 users
│   │   │   │       ├── 📁 pending-users
│   │   │   │       ├── 📁 profile
│   │   │   │       ├── 📁 role-manager
│   │   │   │       └── 📁 users-lists
│   │   │   └── 📁 shared
│   │   │       ├── 📁 main-layout
│   │   │       ├── 📁 sidebar
│   │   │       └── 📁 topbar
│   │   ├── 📁 guards
│   │   ├── 📁 services
│   │   │   ├── 📄 api.service.ts
│   │   │   ├── 📄 auth.interceptor.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 message.service.ts
│   │   │   ├── 📄 notifications.service.ts
│   │   │   ├── 📄 publications.service.ts
│   │   │   ├── 📄 tableaux.service.ts
│   │   │   └── 📄 user.service.ts
│   │   └── 📁 utils
│   │       ├── 📄 interfaces.ts
│   │       ├── 📄 models.ts
│   │       └── 📄 pub-labels.ts
│   └── ..
├── ...
└── ⚙️ tsconfig.spec.json
```
## 5 — Sécurité & contrôle d’accès

* JWT pour authentification ; middleware `auth` pour routes protégées.
* Middleware `authorize(roles[])` pour restreindre les actions sensibles (ex. suppression, approbation).
* Validation côté serveur / sanitation des entrées (XSS, injection).
* Taille/type limites pour upload; validation mime côté serveur.
* Audit minimal : journaux d’action (qui a créé/modifié/supprimé).
---
screenshots link on figma : 
* **Auteur / Équipe** : kaddar moahmed iliass 
---
## 📧 Contact

For screenshot:  get a look at  [figma]([mailto:moahmediliassk@gmail.com](https://www.figma.com/design/YdvceP2EK7JTYQGmWKBnrT/app-inter-departement?node-id=0-1&t=fhdqyo5ZbKtLxOWk-1)).
