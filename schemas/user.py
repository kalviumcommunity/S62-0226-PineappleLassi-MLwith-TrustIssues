from pydantic import BaseModel

class UserResponse(BaseModel):
    user_id: str
    department: str
    role: str