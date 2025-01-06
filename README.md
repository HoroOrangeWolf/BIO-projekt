Jak używacie intallij to można zrobić tak
venv\Scripts\activate i potem 

pip install -r requirements.txt


docker exec postgres_container_bio pg_dump -U postgres -d mgr -h localhost -p 5432 -F c -f /tmp/backup.sql  - zrzut bazy z kontenera
docker cp postgres_container_bio:/tmp/backup.sql  . - kopiowanie bazy na swój komputer do aktualnej lokalizacji

docker cp ./backup.sql postgres_container_bio:/tmp/backup.sql - kopiowanie do konenera
docker exec postgres_container_bio pg_restore -U postgres -d mgr -h localhost -p 5432 -F c /tmp/backup.sql