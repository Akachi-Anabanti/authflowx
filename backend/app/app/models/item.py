from typing import TYPE_CHECKING
from sqlalchemy import Column, ForeignKey, Integer, String
from app.db.base_class import Base
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from .user import User


class Item(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", back_populates="items")
