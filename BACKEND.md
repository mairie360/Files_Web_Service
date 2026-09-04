# Fichiers — tables et routes backend

## Tables

| Table | Données utilisées par le front |
|---|---|
| `files` | Nom, type, taille, propriétaire, catégorie, date de modification et clé de stockage |
| `file_categories` | Libellés proposés lors du téléversement et du filtrage |
| `file_shares` | Utilisateur ou groupe destinataire et droits accordés |
| `users` | Nom du propriétaire et droits de téléversement |
| `groups` | Groupes destinataires d’un partage |

## Routes backend

| Méthode | Route backend | Tables |
|---|---|---|
| `GET` | `/api/v1/files` | `files`, `file_categories`, `users` |
| `GET` | `/api/v1/files/{fileId}` | `files`, `file_categories`, `file_shares`, `users` |
| `POST` | `/api/v1/files` | `files`, `file_categories`, stockage objet |
| `GET` | `/api/v1/files/{fileId}/content` | `files`, stockage objet |
| `GET` | `/api/v1/files/categories` | `file_categories` |
| `POST` | `/api/v1/files/{fileId}/shares` | `file_shares`, `users`, `groups` |
| `DELETE` | `/api/v1/files/{fileId}/shares/{shareId}` | `file_shares` |
| `DELETE` | `/api/v1/files/{fileId}` | `files`, `file_shares`, stockage objet |
