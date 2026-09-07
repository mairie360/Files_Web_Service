# BFF — Fichiers

Référentiel de besoins harmonisé le 5 septembre 2026. Documentation uniquement : aucune route ni migration n'est créée par ces fichiers. Les chemins BFF sont relatifs au service indiqué, pas au préfixe des proxies Next.js ; les chemins backend conservent leurs préfixes réels.

FilesModule utilise des données de démonstration. Aucun BFF Files ni backend Files métier n'est présent dans les sources locales inspectées ; toutes les routes et tables métier ci-dessous sont proposées. Grille/liste, recherche, type et tri utilisent le même jeu de fichiers.

Tables et routes propriétaires : [BACKEND.md](BACKEND.md).

`Existant` : déclaré dans les sources locales ; `Partiel` : route présente mais données manquantes, SQL direct ou mémoire ; `Client généré` : chemin observé dans le client installé, déploiement non vérifié ; `Proposé` : contrat cible à implémenter/valider. Pour les tables, `SQL observé` ne prouve pas qu'une migration est déployée.

## Routes communes

Les identifiants renvoyés par un domaine restent ceux de son backend, même lorsqu'un BFF les sérialise en chaîne. `phone` côté Core/DTO correspond à `users.phone_number` en SQL ; `name`/`fullName` est composé à partir du prénom et du nom, sans découpage automatique inverse. Les rôles d'affichage sont adaptés par chaque front à partir de `roles`, sans nouvelle table de rôles par module. Le profil s'édite dans **Paramètres > Profil** ; les anciennes pages `/profile` ne définissent pas un stockage distinct.

| Méthode | Service et route BFF | Route backend / source | Données nécessaires au front | État |
| --- | --- | --- | --- | --- |
| GET | BFF User `/me` (alias `/session/me`) | Core `GET /api/v1/user/me/` + `GET /api/v1/groups/` | Identité, rôles et groupes communs ; réponse actuelle `{user, groups, roles}` ; enrichir avec identifiant, avatar, service, poste et dernière connexion | Partiel |
| POST | BFF User `/auth/logout` | Actuel : suppression du cookie ; cible : Core `POST /api/v1/sessions/revoke` avec le refresh token de la session courante | Déconnexion ; révocation serveur à brancher, pas une suppression de toutes les sessions | Partiel |
| GET | BFF User `/notifications` | Core `GET /api/v1/user/me/notifications/` | Notifications du bandeau et compteur non lu ; ne pas utiliser la constante de démonstration 3 | Proposé |
| PATCH | BFF User `/notifications/{notificationId}/read` | Core `PATCH /api/v1/user/me/notifications/{notificationId}/read` | Marquage lu et compteur actualisé pour l'utilisateur connecté | Proposé |

## Routes du module

| Méthode | Service et route BFF | Route backend / source | Données nécessaires au front | État |
| --- | --- | --- | --- | --- |
| GET | BFF Files `/files/bootstrap` | Files `GET /api/v1/files/` + `GET /api/v1/file-categories/` + `GET /api/v1/files/storage/me` ; Core annuaire | files, categories, currentUserName issu du profil, quota, droit canUpload et allowedActions par fichier | Proposé |
| GET | BFF Files `/files` | Files `GET /api/v1/files/` | Filtres q/type/category, tri name/recent/size, pagination ; id, nom complet, type, taille, propriétaire, catégorie, modification, isNew | Proposé ; paramètres à implémenter |
| POST | BFF Files `/files` | Files `POST /api/v1/files/` | Upload multipart fichier + catégorie ; propriétaire déduit de la session | Proposé |
| GET | BFF Files `/files/{fileId}` | Files `GET /api/v1/files/{fileId}/` | Métadonnées complètes et accès autorisé à l'aperçu | Proposé |
| GET | BFF Files `/files/{fileId}/download` | Files `GET /api/v1/files/{fileId}/content` | Contenu binaire téléchargé après contrôle d'accès | Proposé |
| DELETE | BFF Files `/files/{fileId}` | Files `DELETE /api/v1/files/{fileId}/` | Suppression autorisée et rafraîchissement de liste/quota | Proposé |
| POST | BFF Files `/files/{fileId}/shares` | Files `POST /api/v1/files/{fileId}/shares/` | Partage : utilisateur/groupe destinataire et droit ; données supplémentaires au callback UI | Proposé |
| DELETE | BFF Files `/files/{fileId}/shares/{shareId}` | Files `DELETE /api/v1/files/{fileId}/shares/{shareId}` | Révocation d'un partage | Proposé |

## Points d'alignement

| Sujet | Contrat / écart |
| --- | --- |
| Affichage | `sizeLabel`, icône, noms tronqués, grille/liste et tri visuel sont calculés côté front. Le contrat garde le nom complet, size_bytes et mime_type. La signification du point vert/isNew et sa durée restent à valider. |
| Pièces jointes partagées | E-mails, Messagerie et Formation référencent le même Files `files.id` dans leurs tables de liaison ; un accès via un message/une formation exige aussi les droits du domaine parent. |

## Sources

| Périmètre | Référence |
| --- | --- |
| Front inspecté | [src/app/page.tsx](src/app/page.tsx) |
| Identité / sessions / groupes | [Core_API 9904624](https://github.com/mairie360/Core_API/tree/99046240dd9742217d2a2c3d282721b785cacca0/src) ; [BFF_user b7c3477](https://github.com/mairie360/BFF_user/tree/b7c3477f858073aa846ba0129cbb29152528e6d2/src) |
| Données des composants partagés | [lib-components 88b339b](https://github.com/mairie360/lib-components/tree/88b339b77d06670b14b5f2f3d1f3d10ed471bb03/src/components/files) |
