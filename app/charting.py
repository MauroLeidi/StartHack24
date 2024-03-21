import ee
import geemap
import folium
import geemap.foliumap as geemap
from typing import List

def init_ee():
    ee.Authenticate()
    ee.Initialize(project='ee-jgetzner')


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


def get_brazil_landcover():
    brazil_shapefile = geemap.shp_to_ee('../data/Brazil/Brazil.shp')
    landcover = ee.Image('MODIS/006/MCD12Q1/2004_01_01').select('LC_Type1').clip(brazil_shapefile)
    igbpLandCoverVis = {
        'min': 1.0,
        'max': 17.0,
        'palette': [
            '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044',
            'dcd159', 'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44',
            'a5a5a5', 'ff6d4c', '69fff8', 'f9ffa4', '1c0dff',
        ],
    }
    return landcover, igbpLandCoverVis


def get_landcover_by_years(years: List[str]):
    init_ee()
    brazil_shapefile = geemap.shp_to_ee('../data/Brazil/Brazil.shp')
    brazil_map = folium.Map(location=[-14.5, -51], zoom_start=4, height=500)
    igbpLandCoverVis = {
        'min': 1.0,
        'max': 17.0,
        'palette': [
            '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044',
            'dcd159', 'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44',
            'a5a5a5', 'ff6d4c', '69fff8', 'f9ffa4', '1c0dff',
        ],
    }
    for year in years:
        lc = ee.Image(f'MODIS/006/MCD12Q1/{year}_01_01').select('LC_Type1')
        lc = lc.clip(brazil_shapefile)
        brazil_map.add_ee_layer(lc, igbpLandCoverVis, str(year))
    #brazil_map.addLayerControl()
    brazil_map.add_child(folium.LayerControl())
    #landcover = ee.Image('MODIS/006/MCD12Q1/2004_01_01').select('LC_Type1')
    #brazil_lc = landcover.clip(brazil_shapefile)
    #brazil_map.add_ee_layer(brazil_lc, igbpLandCoverVis, 'Land Cover')
    return brazil_map._repr_html_()