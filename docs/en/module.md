# Files_Web_Service — Module overview

[Technical documentation](technical.md) · [Français](../fr/module.md) · [README](../../README.md)

Provide access to the document library, uploads and downloads. The interface uses capabilities returned by BFF Files and confirms mutations through a server reload.

## Audience and value

Staff browsing and managing authorized documents.

Business domain: File library.

## Available capabilities

- File and category listing with server metadata.
- Upload gated by `canUpload`, opening and downloading.
- Deletion according to `allowedActions` and data reload.

## Typical workflow

1. Load `/files/bootstrap` to obtain the listing and permissions.
2. Upload when `canUpload` allows it, or choose an allowed action on a file.
3. Wait for the server result and reload the library after a mutation.

## Role within Mairie360

Associated repositories: [BFF_Files](https://github.com/mairie360/BFF_Files).

This repository contains the browser interface and its Next.js adapters. The associated BFF supplies business data and coordinates its sources.

## Data and current state

Bootstrap reads Files API `/api/v1/files/`, `/api/v1/file-categories/` and Core `/api/v1/user/me/`. Files API supplies `canUpload` and `allowedActions`. The BFF forwards bytes and metadata; it does not durably store files or replace missing responses with demo data.

## Scope and limitations

Files API routes and persistence must be available in the deployment. BFF uploads are limited to 20 MiB. The web service hides sharing until a recipient selector is available, even though BFF routes exist.

## Developing or operating this module

The [technical guide](technical.md) covers architecture, configuration, routes, session handling, persistence, tests and CI/CD. It describes sources of truth and contract synchronization with associated repositories.
