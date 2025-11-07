from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "🌍 GaiaNet Backend IS WORKING!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/environment/data")
def get_data():
    return {
        "earth_data": {
            "temperature": 15.2,
            "co2_levels": 417.5,
            "biodiversity_index": 0.78
        }
    }

# Remove the if __name__ block and just run uvicorn directly