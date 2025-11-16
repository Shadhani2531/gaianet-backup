from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

class EnvironmentalData(BaseModel):
    temperature: Dict[str, Any]
    co2: Dict[str, Any]
    vegetation: Dict[str, Any]
    biodiversity: Dict[str, Any]
    last_updated: str
    data_sources: List[str]

class NASAImagery(BaseModel):
    date: str
    image_url: str
    coordinates: Dict[str, float]
    caption: str
    source: str

class WeatherData(BaseModel):
    current: Dict[str, Any]
    forecast: Dict[str, Any]
    alerts: Dict[str, Any]

class GaiaNetStatus(BaseModel):
    system: str
    status: str
    earth_visualization: str
    data_streams: List[str]
    last_data_update: str
    version: str