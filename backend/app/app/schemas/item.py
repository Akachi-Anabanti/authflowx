from typing import Optional
from pydantic import BaseModel


# shared Properties
class ItemBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# properties to receive on item creation
class ItemCreate(ItemBase):
    title: str


# Properties to recieve on item update
class ItemUpdate(ItemBase):
    pass


# Properties shared by models stored in DB
class ItemInDBBase(ItemBase):
    id: int
    title: str
    owner_id: int

    class Config:
        orm_mode = True


# Properties to return to client
class Item(ItemBase):
    pass


# properties stored in DB
class ItemInDB(ItemInDBBase):
    pass
