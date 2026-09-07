# Backend — Fichiers

Correspondance front/BFF : [BFF.md](BFF.md). Référentiel de besoins harmonisé le 5 septembre 2026. Documentation uniquement : aucune route ni migration n'est créée par ces fichiers. Les chemins BFF sont relatifs au service indiqué, pas au préfixe des proxies Next.js ; les chemins backend conservent leurs préfixes réels.

`Existant` : déclaré dans les sources locales ; `Partiel` : route présente mais données manquantes, SQL direct ou mémoire ; `Client généré` : chemin observé dans le client installé, déploiement non vérifié ; `Proposé` : contrat cible à implémenter/valider. Pour les tables, `SQL observé` ne prouve pas qu'une migration est déployée.

Les tables sont des sources ou des besoins cibles, pas un script SQL. Les références interservices (`user_id`, `file_id`, etc.) sont logiques : elles n'imposent pas de clé étrangère entre bases distinctes. Les BFF doivent à terme passer par les API propriétaires ; les accès SQL directs et replis mémoire actuels sont signalés. Les permissions restent contrôlées par le serveur.

## Tables communes

| Table / source propriétaire | Clés et données nécessaires | État |
| --- | --- | --- |
| Core `users` | `id` ; `first_name`, `last_name`, `email`, `phone_number`, `status`, `is_archived`, `first_connect`. `password` reste exclusivement côté serveur | SQL observé |
| Core `roles`, `user_roles` | `roles.id`, `roles.name` ; association `user_roles(user_id, role_id)` vers `users.id` et `roles.id` | SQL observé |
| Core `groups`, `group_users` | `groups.id`, `owner_id`, `name`, `description` ; association `group_users(group_id, user_id)` ; nomenclature cible commune basée sur Core | SQL observé dans Core ; divergence `group_members` dans les BFF User/Calendar/Project à résoudre, pas une seconde table cible |
| Core `sessions` | `id`, `user_id`, `created_at`, `expires_at`, `device_info`, `ip_address`, `revoked_at` ; `token_hash` interne, jamais exposé. Dernière connexion dérivée des sessions, pas de la date courante | SQL observé ; vue `v_sessions` utilisée par Core |
| Core `user_profiles` | `user_id` unique vers `users.id` ; `avatar_file_id` vers Files `files.id`, `service_id` vers `services.id`, `position`, `biography` ; `address`, `city` seulement pour compatibilité des anciens profils | Proposé ; ne pas dupliquer identité, mot de passe ou rôles |
| Core `services` | `id`, `code` unique, `name`, `active` ; même annuaire pour Paramètres, Administration, Calendrier, contacts et membres de projets | Proposé ; distinct des groupes d'habilitation |
| Core `notifications` | `id`, `user_id`, `type`, `title`, `body`, `resource_type`, `resource_id`, `created_at`, `read_at` ; source du compteur commun | Proposé ; distinct des préférences `user_notification_settings` |

## Tables du module

| Table / source propriétaire | Clés et données nécessaires | État |
| --- | --- | --- |
| Files `files` | `id`, `name`, `mime_type`, `size_bytes`, `storage_key`, `owner_id` vers Core users, `category_id`, `created_at`, `updated_at`, `deleted_at` | Proposé ; métadonnées, binaire en stockage objet |
| Files `file_categories` | `id`, `code` unique, `name`, `active` | Proposé ; catégories documentaires, pas l'annuaire Core services |
| Files `file_shares` | `id`, `file_id`, destinataire exclusif `user_id` ou `group_id`, `permission`, `created_by`, `created_at` | Proposé ; utilisateurs/groupes Core, pas de copie d'identité |
| Files `storage_quotas` | `user_id` unique, `limit_bytes` ; utilisé = somme des `files.size_bytes` selon politique de suppression | Proposé ; même source pour Paramètres > Système |
| Files `document_processing_events` | `id`, `file_id`, `processed_by`, `processed_at`, `result` ; un traitement documentaire n'est pas un upload | Proposé ; source du KPI documents traités du Tableau de bord |

## Routes backend communes

| Méthode | Service et route backend | Tables / source | État |
| --- | --- | --- | --- |
| GET | Core `/api/v1/user/me/` | `users`, `roles`, `user_roles` ; cible : `user_profiles`, `services`, `sessions` | Existant ; enrichissement proposé (notamment `id`, absent de GetMeResponseView local) |
| PATCH | Core `/api/v1/user/me/` | `users` ; cible : `user_profiles` | Existant pour prénom, nom, e-mail, téléphone ; extension proposée pour le profil |
| GET | Core `/api/v1/groups/` | `groups`, `group_users` | Existant ; groupes de l'appelant |
| GET | Core `/api/v1/sessions/` | `sessions`, vue `v_sessions` | Existant ; sessions de l'appelant |
| GET | Core `/api/v1/sessions/history` | `sessions`, vue `v_sessions` | Existant ; historique de l'appelant |
| POST | Core `/api/v1/sessions/refresh` | `sessions` ; entrée `refresh_token` | Existant |
| POST | Core `/api/v1/sessions/revoke` | `sessions` ; entrée `refresh_token` | Existant ; ce n'est pas une révocation par `sessionId` |
| DELETE | Core `/api/v1/sessions/{sessionId}` | `sessions` ; session appartenant à l'appelant | Proposé pour la déconnexion d'un autre appareil, sans exposer son refresh token |
| GET | Core `/api/v1/services/` | `services` | Proposé ; annuaire unique |
| GET | Core `/api/v1/users/directory/` | `users`, `user_profiles`, `services`, `roles`, `user_roles`, `groups`, `group_users` | Proposé ; annuaire limité au périmètre autorisé |
| GET | Core `/api/v1/user/me/notifications/` | `notifications` ; filtre utilisateur connecté | Proposé |
| PATCH | Core `/api/v1/user/me/notifications/{notificationId}/read` | `notifications.read_at` ; filtre utilisateur connecté | Proposé |

## Routes backend du module

| Méthode | Service et route backend | Tables / source | État |
| --- | --- | --- | --- |
| GET | Files `/api/v1/files/` | `files`, `file_categories`, `file_shares` ; propriétaire enrichi depuis Core | Proposé |
| POST | Files `/api/v1/files/` | `files`, `storage_quotas`, stockage objet | Proposé ; aussi utilisée pour les avatars de Paramètres |
| GET, DELETE | Files `/api/v1/files/{fileId}/` | `files`, `file_shares`, stockage objet selon politique de suppression | Proposé |
| GET | Files `/api/v1/files/{fileId}/content` | `files`, `file_shares`, stockage objet | Proposé ; accès contrôlé, jamais la clé de stockage brute |
| GET | Files `/api/v1/file-categories/` | `file_categories` | Proposé |
| GET | Files `/api/v1/files/storage/me` | `files`, `storage_quotas` ; somme size_bytes et quota par propriétaire | Proposé ; même route que Paramètres |
| POST | Files `/api/v1/files/{fileId}/shares/` | `file_shares`, références Core users/groups | Proposé |
| DELETE | Files `/api/v1/files/{fileId}/shares/{shareId}` | `file_shares` | Proposé |
| GET | Files `/api/v1/files/stats` | `files`, `document_processing_events` | Proposé ; mêmes statistiques que Tableau de bord |

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
