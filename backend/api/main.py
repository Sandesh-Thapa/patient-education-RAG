from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/", tags=["Welcome"])
def welcome():
    return JSONResponse("API service is running...")