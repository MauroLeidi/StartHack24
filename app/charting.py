import ee
import geemap
import folium
import geemap.foliumap as geemap
from typing import List
# load env variables with dotenv
import os
from dotenv import load_dotenv
load_dotenv("./.env")


GEE_PROJECT = os.environ.get('GEE_PROJECT')


LANDCOVER_TYPE_TO_IDX = {
'Water': 0,
 'Evergreen Needleleaf Forest': 1,
 'Evergreen Broadleaf Forest': 2,
 'Deciduous Needleleaf Forest': 3,
 'Deciduous Broadleaf Forest': 4,
 'Mixed Forest': 5,
 'Closed Shrublands': 6,
 'Open Shrublands': 7,
 'Woody Savannas': 8,
 'Savannas': 9,
 'Grasslands': 10,
 'Permanent Wetlands': 11,
 'Croplands': 12,
 'Urban and Built-up': 13,
 'Cropland/Natural Vegetation Mosaic': 14,
 'Snow and Ice': 15,
 'Barren or Sparsely Vegetated': 16,
 'Unclassified': 254
}

colors = ['05450a', '086a10', '54a708', '78d203', '009900', 'c6b044',
                    'dcd159', 'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44',
                    'a5a5a5', 'ff6d4c', '69fff8', 'f9ffa4', '1c0dff']

LANDCOVER_TYPE_TO_COLOR = {
 'Evergreen Needleleaf Forest': "#05450a",
 'Evergreen Broadleaf Forest': "#086a10",
 'Deciduous Needleleaf Forest': "#54a708",
 'Deciduous Broadleaf Forest': "#78d203",
 'Mixed Forest': "#009900",
 'Closed Shrublands': "#c6b044",
 'Open Shrublands': "#dcd159",
 'Woody Savannas': "#dade48",
 'Savannas': "#fbff13",
 'Grasslands': "#b6ff05",
 'Permanent Wetlands': "#27ff87",
 'Croplands': "#c24f44",
 'Urban and Built-up': "#a5a5a5",
 'Cropland/Natural Vegetation Mosaic': "#ff6d4c",
 'Snow and Ice': "#69fff8",
 'Barren or Sparsely Vegetated': "#f9ffa4",
 'Unclassified': "#1c0dff"
}


def init_ee():
    ee.Authenticate()
    print(GEE_PROJECT)
    ee.Initialize(project=GEE_PROJECT)


def add_ee_layer(self, ee_object, vis_params, name):
    try:
        if isinstance(ee_object, ee.Image):
            map_id_dict = ee.Image(ee_object).getMapId(vis_params)
        elif isinstance(ee_object, ee.ImageCollection):
            ee_object_new = ee_object.median()
            map_id_dict = ee.Image(ee_object_new).getMapId(vis_params)
        elif isinstance(ee_object, ee.Geometry) or isinstance(ee_object, ee.Feature) or isinstance(ee_object,
                                                                                                   ee.FeatureCollection):
            map_id_dict = ee.FeatureCollection(ee_object).getMapId(vis_params)
        else:
            raise ValueError("Could not display the provided Earth Engine object.")

        folium.TileLayer(
            tiles=map_id_dict['tile_fetcher'].url_format,
            attr='Map Data &copy; <a href="https://earthengine.google.com/">Google Earth Engine</a>',
            name=name,
            overlay=True,
            control=True
        ).add_to(self)
    except Exception as e:
        print("Failed to add Earth Engine layer: {}".format(e))


folium.Map.add_ee_layer = add_ee_layer


def get_chart_by_layers(layers: List[str]):
    init_ee()
    brazil_shapefile = geemap.shp_to_ee('../data/Brazil/Brazil.shp')
    brazil_map = folium.Map(location=[-9.26, -55.4], zoom_start=4)
    for layer in layers:
        if layer.startswith("landcover_only"):
            landcover_type = layer.split("_")[2]
            year = layer.split("_")[3]
            lc = ee.Image(f'MODIS/006/MCD12Q1/{year}_01_01').select('LC_Type1')
            lc = lc.clip(brazil_shapefile)
            category_mask = lc.eq(LANDCOVER_TYPE_TO_IDX[landcover_type])
            lc = lc.updateMask(category_mask)
            igb = {
                'palette': [LANDCOVER_TYPE_TO_COLOR[landcover_type]]
            }
            layer_name = landcover_type
        elif layer.startswith("landcover"):
            year = layer.split("_")[1]
            lc = ee.Image(f'MODIS/006/MCD12Q1/{year}_01_01').select('LC_Type1')
            lc = lc.clip(brazil_shapefile)
            igb = {
                'min': 1.0,
                'max': 17.0,
                'palette': [
                    '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044',
                    'dcd159', 'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44',
                    'a5a5a5', 'ff6d4c', '69fff8', 'f9ffa4', '1c0dff',
                ],
            }
            layer_name = f"Land Cover {year}"
        elif layer.startswith("population"):
            # year = layer.split("_")[1]
            dataset = ee.ImageCollection('WorldPop/GP/100m/pop')
            igb = {
                'bands': ['population'],
                'min': 0.0,
                'max': 50.0,
                'palette': ['24126c', '1fff4f', 'd4ff50']
            }
            lc = dataset.mean()
            lc = lc.clip(brazil_shapefile)
            layer_name = 'Population'
        elif layer.startswith(f'burn'):
            year = layer.split("_")[1]
            year_range = (f"{year}-01-01", f"{year}-12-31")
            dataset = ee.ImageCollection('MODIS/061/MCD64A1').filter(ee.Filter.date(year_range[0], year_range[1]))
            burnedArea = dataset.select('BurnDate')
            fc = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(
                'country_na == "Brazil"'
            )
            lc = burnedArea.map(lambda img: img.clipToCollection(fc))
            igb = {
                'min': 30.0,
                'max': 341.0,
                'palette': ['4e0400', '951003', 'c61503', 'ff1901']
            }
            layer_name = "Burned Area"
        elif layer.startswith("Brazil"):
            style = {
                "color": "00ff00",  # Outline color
                "fillColor": "0000ff60",  # Interior color with opacity (60 at the end represents opacity in hex)
                "width": 2,  # Outline width
            }
            lc = brazil_shapefile.style(**style)
            igb = {}
            layer_name = "Brazil"
        elif layer.startswith("biomes"):
            lc = geemap.shp_to_ee('../data/Brazil Biomes/Brazil_biomes.shp')
            style = {
                "color": "ff0000",  # Outline color
                "fillColor": "ffff0060",  # Interior color with opacity
                "width": 1,  # Outline width
            }
            lc = lc.style(**style)  # Apply the style
            layer_name = "Biomes"
            igb = {}
        elif layer.startswith("urban"):
            year = layer.split("_")[1]
            lc = ee.Image(f'MODIS/006/MCD12Q1/{year}_01_01').select('LC_Type1')
            lc = lc.clip(brazil_shapefile)
            category_mask = lc.eq(13)
            lc = lc.updateMask(category_mask)
            igb = {
                'min': 1.0,
                'max': 1.0,  # Since we're only visualizing one class, min and max can both be set to 1.
                'palette': ['ffc0cb'],  # Urban and Built-up color (assuming grey here, replace with the desired color).
            }

            # Add the layer to the map. Since we're only visualizing one class, the name doesn't need a year.
            layer_name = f"Urban and Built-up Land Cover {year}"
            brazil_map = folium.Map(location=[-21.1767, -47.8208], zoom_start=10, height=500)
        brazil_map.add_ee_layer(lc, igb, layer_name)
    brazil_map.add_child(folium.LayerControl())
    return brazil_map._repr_html_()