from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import asyncio
from nasa_client import NASAClient
from data_models import EnvironmentalData, NASAImagery, WeatherData

app = FastAPI(title="GaiaNet API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NASA client
nasa_client = NASAClient()

@app.get("/")
async def root():
    return {
        "message": "GaiaNet Planetary Intelligence API",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/environment/data")
async def get_environmental_data():
    """Get comprehensive environmental data"""
    try:
        data = await nasa_client.get_environmental_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching environmental data: {str(e)}")

@app.get("/api/nasa/imagery")
async def get_nasa_imagery(lat: float = 40.7128, lon: float = -74.0060, date: str = None):
    """Get NASA Earth imagery"""
    try:
        imagery_data = await nasa_client.get_earth_imagery(lat, lon, date)
        return JSONResponse(content=imagery_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NASA imagery: {str(e)}")

@app.get("/api/nasa/weather")
async def get_weather_data():
    """Get weather and climate data"""
    try:
        weather_data = await nasa_client.get_weather_data()
        return JSONResponse(content=weather_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@app.get("/api/gaianet/status")
async def get_gaianet_status():
    """Get GaiaNet system status"""
    return {
        "system": "GaiaNet Planetary Intelligence",
        "status": "operational",
        "earth_visualization": "active",
        "data_streams": ["environmental", "imagery", "weather"],
        "last_data_update": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)