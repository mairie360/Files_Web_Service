# Fichiers — routes BFF

| Méthode | Route BFF | Besoin du front | État |
|---|---|---|---|
| `GET` | `/files/bootstrap` | Utilisateur courant, catégories, droits et première page de fichiers | À créer |
| `GET` | `/files` | Recherche, filtre par type, tri et pagination | À créer |
| `GET` | `/files/{fileId}` | Ouverture et métadonnées d’un fichier | À créer |
| `POST` | `/files` | Téléversement d’un fichier et choix de sa catégorie | À créer |
| `GET` | `/files/{fileId}/download` | Téléchargement d’un fichier | À créer |
| `POST` | `/files/{fileId}/shares` | Partage avec un utilisateur ou un groupe | À créer |
| `DELETE` | `/files/{fileId}/shares/{shareId}` | Retrait d’un partage | À créer |
| `DELETE` | `/files/{fileId}` | Suppression d’un fichier | À créer |
