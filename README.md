# meteor-song

## Lancer l'application
1. Cloner le git `git clone https://www.github.com/afieve/meteor-song`
2. Naviguer vers le répertoire du projet `cd meteor-song` 
2. Application serveur :
    1. Installer les dépendances 
        1. `cd api` 
        2. `npm install`
    2. Lancer l'application: `npm start` 
3. Application client :
    1. Installer les dépendances 
        1. `cd client` 
        2. `npm install`
    2. Lancer l'application: `npm start` 
    
## Répertoires
- `/client` : fichiers de l'application client React
- `/api` : fichiers de l'application serveur, qui doit être nommé ainsi pour être exploitée par Vercel. Contient 
    - les traitements sur les données pour les adapter à la logique métier, 
    - les appels à 
        - la base de données
        - l'API vers les données, ouverte à l'application client.
- `/data` : données métier, sous forme de fichiers durant le développement, qui deviendront inutiles une fois hébergés sur la base de données. À sauvegarder précautionneusement.

## Fichiers
- `vercel.json` : Fichier de configuration pour indiquer à Vercel :
    - les builds des différentes parties de l'application (`server` et `client`), et les commandes que Vercel devra utiliser pour les exécuter.
    - les routes vers les différentes parties de l'application.

