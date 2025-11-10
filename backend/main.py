from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any

app = FastAPI(
    title="GaiaNet API",
    description="Earth Environmental Data API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "GaiaNet API Server Running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/environment/current")
async def get_current_environment():
    """Get current environmental data"""
    return {
        "temperature": 15.2,
        "co2_levels": 417.5,
        "deforestation_rate": 0.08,
        "biodiversity_index": 0.76,
        "air_quality": 85.2,
        "sea_level_rise": 3.4,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/environment/metrics")
async def get_environment_metrics():
    """Get environmental metrics with trends"""
    return {
        "metrics": {
            "global_temperature": {"value": 15.2, "unit": "°C", "change": "+1.1", "trend": "rising"},
            "co2_concentration": {"value": 417.5, "unit": "ppm", "change": "+2.5", "trend": "rising"},
            "sea_level_rise": {"value": 3.4, "unit": "mm/year", "change": "+0.3", "trend": "rising"},
            "forest_cover_loss": {"value": 10.1, "unit": "M hectares/year", "change": "-0.2", "trend": "improving"},
            "biodiversity_index": {"value": 76.0, "unit": "%", "change": "-2.1", "trend": "declining"}
        },
        "last_updated": datetime.now().isoformat()
    }

@app.get("/api/layers")
async def get_available_layers():
    """Get available data layers"""
    return {
        "layers": [
            {"id": "temperature", "name": "Temperature Heatmap", "description": "Global temperature distribution"},
            {"id": "vegetation", "name": "Vegetation Index", "description": "NDVI vegetation health"},
            {"id": "co2", "name": "CO2 Concentration", "description": "Atmospheric CO2 levels"},
            {"id": "deforestation", "name": "Deforestation", "description": "Forest cover changes"},
            {"id": "night_lights", "name": "Night Lights", "description": "Human activity at night"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)