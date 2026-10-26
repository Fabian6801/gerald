from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.features.bookings.router import router as booking_router

app = FastAPI(title="Gerald API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(booking_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Gerald Backend running!"}