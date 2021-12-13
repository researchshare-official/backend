# How to run

Fetch the env from the discord or a random guy

backend.env for backend environnement
db.env for postgres vars and credentials

Use the following env variables :
  * PORT defaults to 3000
  * SESSION_SECRET this one is REQUIRED !!!

```sh
docker build -t <image_name> .
```

```sh
docker run --init <image_name>
```

docker-compose
```sh
docker-compose up --build -d
```

