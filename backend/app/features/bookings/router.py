from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.database import supabase

router = APIRouter()

class BookingCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: str
    date: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None

@router.post("/book")
def create_booking(body: BookingCreate):
    if not body.name or not body.phone or not body.service:
        raise HTTPException(status_code=400, detail="Missing required fields")

    try:
        result = supabase.table("bookings").insert({
            "client_name": body.name,
            "phone": body.phone,
            "email": body.email,
            "service": body.service,
            "preferred_date": body.date,
            "location": body.location,
            "details": body.message,
            "status": "pending"
        }).execute()
        
        return {"success": True, "data": result.data}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))