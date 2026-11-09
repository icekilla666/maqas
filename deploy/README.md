# Развёртывание Maqas

[← Обзор проекта](../README.md) · [Frontend](../frontend/README.md) · [Backend](../backend/README.md)

Приложение запускается через Docker Compose: nginx принимает HTTPS-запросы, frontend отдаёт клиентскую сборку, backend обслуживает API и WebSocket, PostgreSQL хранит данные в томе `postgres_data`

## Подготовка

Нужны сервер с Docker и Docker Compose, домен, направленный на сервер, и TLS-сертификат. Текущая конфигурация рассчитана на `maqas.ru` и `www.maqas.ru`; при смене домена обновите `nginx.conf`, `VERIFY_EMAIL_URL` в `docker-compose.yml` и проверку домена в `deploy/check.sh`

В корне проекта создайте `.env` из `.env.example`, а в `backend/` — `.env` из `backend/.env.example`. При обновлении существующей установки сохраните текущие файлы и значения: не перезаписывайте их примерами

Заполните пароль PostgreSQL, настройки JWT, SMTP и Cloudinary. Docker Compose подставляет `DATABASE_URL` и `VERIFY_EMAIL_URL` для backend. Для существующей базы используйте её действующие учётные данные: изменение переменной пароля не меняет пароль в уже созданной базе

Поместите файлы сертификата на сервер:

```text
deploy/certs/fullchain.pem   сертификат домена и промежуточные сертификаты
deploy/certs/privkey.pem     соответствующий приватный ключ
```

Сертификат должен покрывать используемые домены. Закройте посторонним доступ к `.env` и приватному ключу; не добавляйте их в Git

## Запуск

Из корня проекта:

```sh
bash deploy/check.sh
docker compose up -d --build
docker compose ps
```

`check.sh` проверяет наличие окружения, сертификат, соответствие ключа и конфигурацию nginx. Само приложение он не перезапускает

## Обновление

Перед обновлением базы сделайте резервную копию и ознакомьтесь с миграциями backend. Убедитесь, что на сервере нет несохранённых изменений, конфликтующих с обновлением

```sh
git pull --ff-only
docker compose build
```

Если обновление требует миграций, порядок остановки приложения и применения миграций согласуйте с разработчиком backend. Команда применения миграций при работающей базе:

```sh
docker compose run --rm --no-deps backend alembic upgrade head
```

После необходимых миграций:

```sh
docker compose up -d
docker compose ps
```

Автоматическое `create_all` при старте backend не заменяет миграции существующих таблиц. Для простой перезагрузки без изменения кода используйте `docker compose restart`; для доставки изменений нужна пересборка образов

## Диагностика

```sh
docker compose logs --tail=100 backend
docker compose logs --tail=100 nginx
docker compose logs --tail=100 db
docker stats --no-stream
```

Перед публикацией логов удаляйте токены, пароли, адреса электронной почты и личные данные пользователей

## Резервная копия базы

При работающем сервисе `db`:

```sh
mkdir -p deploy/backups
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "deploy/backups/maqas-$(date +%Y%m%d-%H%M%S).dump"
```

Проверьте успешность команды и храните копии также вне сервера. `deploy/backups/` исключён из Git. Не используйте `docker compose down -v` для обычного обновления: эта команда удаляет том базы данных
