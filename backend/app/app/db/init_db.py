from sqlalchemy.orm import Session
from app import crud, schemas
from app.core.config import settings
from app.db.base_class import Base
from app.db.session import engine

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)

    if not user:
        user_in = schemas.UserCreate(
            email=settings.FIRST_SUPERUSER,
            uuid="d97612c0-71e5-4a72-b027-34efae4c0142",
            is_superuser=True,
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841
