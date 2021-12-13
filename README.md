# How to run

Fetch the env from the discord or a random guy

backend.env for backend environnement
db.env for postgres vars and credentials

Use the following env variables :

* PORT defaults to 3000
* SESSION_SECRET this one is REQUIRED !!!
* DATABASE_URL this one is Required to connect to the postgres DB

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

### To Setup the DB 
Edit what you want as tables in prisma/schema.prisma like
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  createdAt DateTime @default(now()) @db.Timestamp(6)
  content   String?
  published Boolean  @default(false)
  authorId  Int
  User      User     @relation(fields: [authorId], references: [id])
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique
  User   User    @relation(fields: [userId], references: [id])
}

model User {
  id      Int      @id @default(autoincrement())
  name    String?  @db.VarChar(255)
  email   String   @unique @db.VarChar(255)
  Post    Post[]
  Profile Profile?
}
```

To convert it and inject it to the postgres db
```sh
yarn prisma migrate dev --name init
```
