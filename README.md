Jak używacie intallij to można zrobić tak
venv\Scripts\activate i potem 

pip install -r requirements.txt


pg_dump -U postgres -d mgr -h localhost -p 5432 -F c -f backup.sql
psql -U postgres -d mgr -h localhost -p 5432 -f backup.sql
pg_restore -U postgres -d mgr -h localhost -p 5432 -F c backup.sql