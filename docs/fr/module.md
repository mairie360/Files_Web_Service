# Files_Web_Service — Présentation du module

[Documentation technique](technical.md) · [English](../en/module.md) · [README](../../README.md)

Donner accès à la bibliothèque documentaire, aux dépôts et aux téléchargements. L’interface applique les capacités renvoyées par BFF Files et confirme les mutations par un rechargement serveur.

## Public et utilité

Les agents qui consultent et gèrent leurs documents autorisés.

Domaine fonctionnel: Bibliothèque de fichiers.

## Fonctions disponibles

- Liste de fichiers et catégories avec les métadonnées du serveur.
- Upload autorisé par `canUpload`, ouverture et téléchargement.
- Suppression selon `allowedActions` et rechargement des données.

## Parcours type

1. Charger `/files/bootstrap` pour obtenir la liste et les permissions.
2. Déposer un fichier si `canUpload` le permet, ou choisir une action autorisée sur un fichier.
3. Attendre le résultat du serveur et recharger la bibliothèque après une mutation.

## Place dans Mairie360

Dépôts associés: [BFF_Files](https://github.com/mairie360/BFF_Files).

Ce dépôt contient l’interface navigateur et ses adaptateurs Next.js. Le BFF associé fournit les données métier et coordonne leurs sources.

## Données et état actuel

Le bootstrap lit Files API `/api/v1/files/`, `/api/v1/file-categories/` et Core `/api/v1/user/me/`. Files API fournit `canUpload` et `allowedActions`. Le BFF transmet les octets et les métadonnées; il ne stocke pas durablement les fichiers et ne remplace pas une réponse absente par des données de démonstration.

## Périmètre et limites

Les routes et la persistance de Files API doivent être disponibles dans le déploiement. Les uploads sont limités à 20 MiB côté BFF. Le web service masque le partage tant qu’un sélecteur de destinataire n’est pas disponible, même si les routes BFF existent.

## Pour développer ou exploiter ce module

Le [guide technique](technical.md) détaille architecture, configuration, routes, session, persistance, tests et CI/CD. Il décrit les sources de vérité et les étapes de synchronisation des contrats avec les dépôts associés.
