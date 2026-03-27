from fastapi import FastAPI
from api.v1.api import api_router

app = FastAPI(title="Climate Sense API")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FastAPI is running"}