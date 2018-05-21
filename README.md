# IMPORTANT /!\

Pour lancer le projet, ajoutez à la racine un fichier `settings.json` avec ce contenu :

```json
{
    "email": "postmaster%40sandbox0aaa25ccaef24451892d935465f107a1.mailgun.org",
    "password": "d663ad121eec9d60ec50334fb2e0ed43",
    "smtp": "smtp.mailgun.org",
    "port": "465",
    "protocol": "smtps",
    "admin": {
        "username": "admin",
        "password": "admin"
    }
}
```

Puis lancer la commande `npm start`

/!\ Lancez le serveur avant l'application pour que le port 3000 soit libre pour le serveur.