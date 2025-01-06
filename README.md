Jak używacie intallij to można zrobić tak
venv\Scripts\activate i potem 

pip install -r requirements.txt



docker exec postgres_container_bio pg_restore -U postgres -d mgr -h localhost -p 5432 -F c /tmp/backup.sql