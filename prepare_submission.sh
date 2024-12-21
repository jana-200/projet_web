#!/bin/bash

# Exécute le script 'install.sh' et vérifie si son exécution est réussie
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    bash install-windows.sh
else
    bash install-unix.sh
fi


if [ $? != 0 ]; then
    echo "Le script d'installation a échoué" >&2
    exit 1
fi

# Démarre l'application en arrière-plan et enregistre son PID
npm start > /dev/null & 
PID=$!

# Attend 5 secondes pour que l'application démarre
sleep 5

# Vérifie si l'application est accessible sur le port local 3000
curl -f http://localhost:3000 > /dev/null 2>&1
if [ $? != 0 ]; then
    echo "Le lancement de l'application a échoué" >&2
    exit 1
fi

# Termine le processus de l'application en utilisant son PID
kill -TERM $PID

# Confirme que l'application est fonctionnelle
echo "L'application est fonctionnelle"

# Crée une archive zip du projet en excluant les node_modules et la base de données
git archive --format=zip --output=project_group_XX_FRISTNAME_LASTNAME.zip HEAD \
  -- . ":!*.git*" ":!*.zip" ":!*sqlite*" ":!*node_modules*" ":!*data*"
