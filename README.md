# Projet web 2024 - Groupe XX

Ce repository GitHub reprend le boilerplate du code de votre projet web, ou la base à partir de laquelle vous allez déveloper.

## Apprentissage de Git et GitHub

Suivez le document proposé sur moodle pour apprendre à utiliser Git et GitHub durant votre projet.

## Installation du projet

Si ce n'est pas encore fait, renommez l'un de fichiers `bd_install-french.sql` ou `db_install-english.sql` en `db_install.sql`, selon la langue que vous avez choisie pour l'interface de votre site web.

Lancez ensuite le script qui va créer le fichier de base de données et installer les dépendances de l'application. Commencez par ouvrir un terminal. Attention, il faut utiliser le terminal Git Bash sur Windows, au lieu de cmd ou de PowerShell.

Si vous êtes sur windows, lancez la commande :

```sh
bash install-windows.sh
```

Si vous êtes sur macOS ou linux, lancez la commande :

```sh
bash install-unix.sh
```

## Lancer le projet

Une fois que le projet est préparé tel qu'expliqué dans la section précédente, vous pouvez le lancer avec la commande suivante :

```sh
npm start
```

## Préparation de la soumission

Lorsque vous voudrez soumettre votre projet, utilisez la commande suivante dans un terminal (Git Bash et pas cmd ou PowerShell sur Windows) ouvert à la racine du projet :

```bash
bash prepare_submission.sh
```

Si votre projet est fonctionnel, cette commande crée un fichier `project_group_XX_FRISTNAME_LASTNAME.zip`. Autrement, la commande affiche une erreur dans le terminal.
