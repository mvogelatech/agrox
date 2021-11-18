
  

# API Visiona Index

Examples of API calls

  - [Areas](#areas)
	  - [List](#list)
	  - [List By Id](#list-by-id)
	  - [Create](#create)
	  - [Delete](#delete)
 - [Observations](#observations)
	 - [List](#list-1)
	 - 	[List By Id](#list-by-id-1)
	 - [Get Image](#get-image)

# Areas

## List
Lists all monitored areas, no search parameters required

### Request

`GET /api/indice/areas`

### Example HTTP
	GET /api/indice/areas HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Cache-Control: no-cache


### Example cURL
    curl -X GET \
    http://www.visionaplatform.com:3003/api/indice/areas \
    -H 'Authorization: Basic <access_token>' \
    -H 'Content-Type: application/json'

### Response    
	
	[
	    {
	        "id": 1,
	        "name": "Talhão 1",
	        "date": "2020-09-30T03:00:00.000Z",
	        "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.82423210144043,-12.16956811119965],[-45.77007293701171,-12.16956811119965],[-45.77007293701171,-12.124257226027643],[-45.82423210144043,-12.124257226027643],[-45.82423210144043,-12.16956811119965]]]}}",
	        "nome_safra": "2019/2020",
	        "nome_imovel": "Propiedade 1"
	    }
	]
           
## List By Id
Lists monitored area by id

### Request

`GET /api/indice/area/<id>`

### Example HTTP
	GET /api/indice/area/<id> HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Cache-Control: no-cache


### Example cURL
    curl -X GET \
    http://www.visionaplatform.com:3003/api/indice/area/<id> \
    -H 'Authorization: Basic <access_token>' \
    -H 'Content-Type: application/json'

### Response    
	
	{
    "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.872726,-12.161681],[-45.872726,-12.149767],[-45.861912,-12.149767],[-45.861912,-12.161681],[-45.872726,-12.161681]]]}}",
    "area": {
        "id": 18,
        "name": "Imóvel 2",
        "date": "2020-10-21T03:00:00.000Z",
        "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.872726,-12.161681],[-45.872726,-12.149767],[-45.861912,-12.149767],[-45.861912,-12.161681],[-45.872726,-12.161681]]]}}",
        "contract_id": 1,
        "area_rural_id": 13,
        "talhao": {
            "id": 13,
            "ano_agricola_id": 19,
            "name": "Imóvel 2",
            "area_ha": "10.0000",
            "cultura_id": 1,
            "plantio_date": "2020-10-14T03:00:00.000Z",
            "colheita_date": "2020-10-21T03:00:00.000Z",
            "qt_producao": "3.0000",
            "qt_semente": "3",
            "spatial_geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.872726,-12.161681],[-45.872726,-12.149767],[-45.861912,-12.149767],[-45.861912,-12.161681],[-45.872726,-12.161681]]]}}",
            "ativado": true,
            "safra": {
                "id": 19,
                "imovel_rural_id": 22,
                "start_date": "2019-09-01T03:00:00.000Z",
                "end_date": "2020-10-01T03:00:00.000Z",
                "categoria": "safra",
                "ativado": true,
                "imovel": {
                    "id": 22,
                    "name": "Fazenda Vitória",
                    "aoi": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.87307,-12.169568],[-45.87307,-12.141711],[-45.85041,-12.141711],[-45.85041,-12.169568],[-45.87307,-12.169568]]]}}",
                    "ativado": true,
                    "user_id": 62
                }
            }
        },
        "nome_talhao": "Imóvel 2",
        "nome_safra": "2019/2020",
        "nome_imovel": "Fazenda Vitória"
    },
    "shape": {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -45.872726,
                                -12.161681
                            ],
                            [
                                -45.872726,
                                -12.149767
                            ],
                            [
                                -45.861912,
                                -12.149767
                            ],
                            [
                                -45.861912,
                                -12.161681
                            ],
                            [
                                -45.872726,
                                -12.161681
                            ]
                        ]
                    ]
                }
            }
        ]
    },
    "observations": [
        {
            "date": "2020-06-28T13:22:41-03:00",
            "id": "S2A_MSIL1C_20200628T132241_N0209_R038_T23LLG_20200628T150227",
            "folder": "2020-06-28_S2A_MSIL1C_20200628T132241_N0209_R038_T23LLG_20200628T150227",
            "stats": {
                "metadata": {
                    "title": "S2A_MSIL1C_20200628T132241_N0209_R038_T23LLG_20200628T150227",
                    "link": "https://scihub.copernicus.eu/dhus/odata/v1/Products('e68d7376-4240-4623-bf80-4dcc494722ec')/$value",
                    "link_alternative": "https://scihub.copernicus.eu/dhus/odata/v1/Products('e68d7376-4240-4623-bf80-4dcc494722ec')/",
                    "link_icon": "https://scihub.copernicus.eu/dhus/odata/v1/Products('e68d7376-4240-4623-bf80-4dcc494722ec')/Products('Quicklook')/$value",
                    "summary": "Date: 2020-06-28T13:22:41.024Z, Instrument: MSI, Mode: , Satellite: Sentinel-2, Size: 779.50 MB",
                    "datatakesensingstart": "Timestamp('2020-06-28 13:22:41.024000')",
                    "beginposition": "Timestamp('2020-06-28 13:22:41.024000')",
                    "endposition": "Timestamp('2020-06-28 13:22:41.024000')",
                    "ingestiondate": "Timestamp('2020-06-28 18:19:13.716000')",
                    "orbitnumber": 26204,
                    "relativeorbitnumber": 38,
                    "cloudcoverpercentage": 0.2197,
                    "sensoroperationalmode": "INS-NOBS",
                    "gmlfootprint": "<gml:Polygon srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\" xmlns:gml=\"http://www.opengis.net/gml\">\\n   <gml:outerBoundaryIs>\\n      <gml:LinearRing>\\n         <gml:coordinates>-11.753598992978919,-46.835297 -11.758300454469065,-45.82785 -12.751141220903948,-45.830933 -12.746030391294726,-46.842163 -11.753598992978919,-46.835297</gml:coordinates>\\n      </gml:LinearRing>\\n   </gml:outerBoundaryIs>\\n</gml:Polygon>",
                    "footprint": "MULTIPOLYGON (((-45.830933 -12.751141220903948, -45.82785 -11.758300454469065, -46.835297 -11.753598992978919, -46.842163 -12.746030391294726, -45.830933 -12.751141220903948)))",
                    "level1cpdiidentifier": "S2A_OPER_MSI_L1C_TL_SGS__20200628T150227_A026204_T23LLG_N02.09",
                    "tileid": "23LLG",
                    "hv_order_tileid": "LG23L",
                    "format": "SAFE",
                    "processingbaseline": "02.09",
                    "platformname": "Sentinel-2",
                    "filename": "S2A_MSIL1C_20200628T132241_N0209_R038_T23LLG_20200628T150227.SAFE",
                    "instrumentname": "Multi-Spectral Instrument",
                    "instrumentshortname": "MSI",
                    "size": "779.50 MB",
                    "s2datatakeid": "GS2A_20200628T132241_026204_N02.09",
                    "producttype": "S2MSI1C",
                    "platformidentifier": "2015-028A",
                    "orbitdirection": "DESCENDING",
                    "platformserialidentifier": "Sentinel-2A",
                    "processinglevel": "Level-1C",
                    "identifier": "S2A_MSIL1C_20200628T132241_N0209_R038_T23LLG_20200628T150227",
                    "uuid": "e68d7376-4240-4623-bf80-4dcc494722ec",
                    "roi_coverage": 100
                },
                "satellite": "Sentinel-2A/B",
                "product_id": "e68d7376-4240-4623-bf80-4dcc494722ec",
                "processing_date": "2020-10-21 22:14:42.794980",
                "acquisition_date": "2020-06-28 13:22:41.024",
                "pixel": {
                    "total": 15327,
                    "valid": 15327,
                    "cloud": 0,
                    "shadow": 0,
                    "nodata": 0
                },
                "indice": {
                    "true_color": {
                        "min": {
                            "red": 0.0431372549,
                            "green": 0.062745098,
                            "blue": 0.0745098039
                        },
                        "max": {
                            "red": 0.431372549,
                            "green": 0.4078431373,
                            "blue": 0.3960784314
                        },
                        "std": {
                            "red": 0.0334525815,
                            "green": 0.0215063165,
                            "blue": 0.0157464429
                        },
                        "mean": {
                            "red": 0.0908467308,
                            "green": 0.0854667593,
                            "blue": 0.0910117606
                        },
                        "mode": {
                            "red": 0.0823529412,
                            "green": 0.0784313725,
                            "blue": 0.0862745098
                        },
                        "median": {
                            "red": 0.0823529412,
                            "green": 0.0784313725,
                            "blue": 0.0862745098
                        }
                    },
                    "savi": {
                        "min": -0.1137254902,
                        "max": 0.4352941176,
                        "std": 0.044921458,
                        "mean": 0.2396665119,
                        "mode": 0.2235294118,
                        "median": 0.231372549
                    },
                    "ndwi": {
                        "min": -0.231372549,
                        "max": 0.1607843137,
                        "std": 0.0645606989,
                        "mean": -0.0735078555,
                        "mode": -0.1137254902,
                        "median": -0.0823529412
                    },
                    "ndvi": {
                        "min": -0.1215686275,
                        "max": 0.6784313725,
                        "std": 0.0810835421,
                        "mean": 0.421110254,
                        "mode": 0.4117647059,
                        "median": 0.4196078431
                    },
                    "ndre": {
                        "min": -0.1529411765,
                        "max": 0.4666666667,
                        "std": 0.0543748109,
                        "mean": 0.2441220606,
                        "mode": 0.2392156863,
                        "median": 0.2392156863
                    },
                    "greenness": {
                        "min": 0.0039215686,
                        "max": 0.3058823529,
                        "std": 0.0330583104,
                        "mean": 0.1453797412,
                        "mode": 0.1254901961,
                        "median": 0.1411764706
                    },
                    "fcover": {
                        "min": 0.4901960784,
                        "max": 1,
                        "std": 0.0831256504,
                        "mean": 0.578620837,
                        "mode": 0.5411764706,
                        "median": 0.5529411765
                    },
                    "false_color": {
                        "min": {
                            "swir1": 0.1647058824,
                            "nir": 0.168627451,
                            "blue": 0.0745098039
                        },
                        "max": {
                            "swir1": 0.5215686275,
                            "nir": 0.4196078431,
                            "blue": 0.3960784314
                        },
                        "std": {
                            "swir1": 0.0376484076,
                            "nir": 0.0333162459,
                            "blue": 0.0157464429
                        },
                        "mean": {
                            "swir1": 0.2567134507,
                            "nir": 0.2231609731,
                            "blue": 0.0910117606
                        },
                        "mode": {
                            "swir1": 0.2509803922,
                            "nir": 0.2039215686,
                            "blue": 0.0862745098
                        },
                        "median": {
                            "swir1": 0.2509803922,
                            "nir": 0.2156862745,
                            "blue": 0.0862745098
                        }
                    }
                }
            }
        },


## Create
Creates the monitoring areas, a json is required as a parameter in the request body

### Request

`POST /api/indice/areas/create`

### Example HTTP
	POST /api/indice/areas/create HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Content-Type: application/json
	Cache-Control: no-cache
	{
		"name": "<name>",
		"geojson": {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-49.26654575200001,-22.23220989399999],[-49.23412475499998,-22.23220989399999],[-49.23412475499998,-22.212560114999974],[-49.26654575200001,-22.212560114999974],[-49.26654575200001,-22.23220989399999]]]}}
	}

### Example cURL
	curl -X POST \
	  http://www.visionaplatform.com:3003/api/indice/areas/create \
	  -H 'authorization: Basic <access_token>' \
	  -H 'cache-control: no-cache' \
	  -H 'content-type: application/json' \
	  -d '{
		"name": "<name>",
		"geojson": {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-49.26654575200001,-22.23220989399999],[-49.23412475499998,-22.23220989399999],[-49.23412475499998,-22.212560114999974],[-49.26654575200001,-22.212560114999974],[-49.26654575200001,-22.23220989399999]]]}}
	}'
	

### Response

    {
	    "id": <id>,
	    "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-49.26654575200001,-22.23220989399999],[-49.23412475499998,-22.23220989399999],[-49.23412475499998,-22.212560114999974],[-49.26654575200001,-22.212560114999974],[-49.26654575200001,-22.23220989399999]]]}}",
	    "date": "2020-10-15T03:00:00.000Z"
    }
## Delete
Removes monitoring area, area id required

### Request

`GET api/indice/areas/delete?id=<id>`

### Example HTTP
	GET /api/indice/areas/delete?id=<id> HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Cache-Control: no-cache

    
### Example cURL
	curl -X GET \
	  'http://www.visionaplatform.com:3003/api/indice/areas/delete?id=<id>' \
	  -H 'authorization: Basic <access_token>' \
	  -H 'cache-control: no-cache' \
	  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
	  -F id=<id>


### Response

    success

# Observations

## List
Lists all monitored indices for all areas

### Request

`GET /api/indice/list`

### Example HTTP
	GET /api/indice/list HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Cache-Control: no-cache

### Example cURL
	curl -X GET \
	  http://www.visionaplatform.com:3003/api/indice/list \
	  -H 'authorization: Basic <access_token>' \
	  -H 'cache-control: no-cache' 

### Response

    [
	    {
	        "area": {
	            "id": 1,
	            "name": "Talhão 1",
	            "date": "2020-09-30T03:00:00.000Z",
	            "nome_safra": "2019/2020",
	            "nome_imovel": "Propiedade 1",
	            "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.82423210144043,-12.16956811119965],[-45.77007293701171,-12.16956811119965],[-45.77007293701171,-12.124257226027643],[-45.82423210144043,-12.124257226027643],[-45.82423210144043,-12.16956811119965]]]}}"
	        }, ...
	]
## List by Id
Lists monitored indices by id

### Request

`GET /api/indice/list/<id>`

### Example HTTP
	GET /api/indice/list/<id> HTTP/1.1
	Host: www.visionaplatform.com:3003
	Authorization: Basic <access_token>
	Cache-Control: no-cache

### Example cURL
	curl -X GET \
	  http://www.visionaplatform.com:3003/api/indice/list/<id> \
	  -H 'authorization: Basic <access_token>' \
	  -H 'cache-control: no-cache' 

### Response
	[
		    {
		        "area": {
		            "id": <id>,
		            "name": "Talhão 1",
		            "date": "2020-09-30T03:00:00.000Z",
		            "nome_safra": "2019/2020",
		            "nome_imovel": "Propiedade 1",
		            "geojson": "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[-45.82423210144043,-12.16956811119965],[-45.77007293701171,-12.16956811119965],[-45.77007293701171,-12.124257226027643],[-45.82423210144043,-12.124257226027643],[-45.82423210144043,-12.16956811119965]]]}}"
		        },
		        "observations": [
			        {
		                "stats": {
		                    "satellite": "Sentinel-2A/B",
		                    "processing_date": "2020-05-04 13:22:29.024000",
		                    "acquisition_date": "2020-05-04 13:22:29.024000",
		                    "indice": {
		                        "savi": {
		                            "min": -0.2,
		                            "max": 0.6705882353,
		                            "std": 0.1189153923,
		                            "mean": 0.4261857987,
		                            "mode": 0.3803921569,
		                            "median": 0.4039215686,
		                            "browseUrl": "http://www.visionaplatform.com/api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LMG_20200504T140528/savi"
		                        },
		                        "true_color": {
		                            ...
		                        },
		                        "ndwi": {
		                            ...
		                        },
		                        "ndvi": {
		                            ...
		                        },
		                        "ndre": {
		                            ...
		                        },
		                        "greenness": {
		                            ...
		                        },
		                        "fcover": {
		                           ...
		                        },
		                        "false_color": {
		                            ...
		                        }
		                    }
		                },
		                "id": "2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LMG_20200504T140528",
		                "date": "2020-05-04T13:22:29-03:00"
		            }
		        ]
	        }
		]

## Get image

The PNG image of each index will be contained in the observation metadata.

	"browseUrl": "http://www.visionaplatform.com/api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LMG_20200504T140528/savi"

To access the other indexes just change at the end of the url.
### Example

#### SAVI
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/savi HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache

#### True color
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/true_color HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache

#### NDWI
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/ndwi HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache
	
#### NDVI
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/ndvi HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache
	
#### NDRE
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/ndre HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache
	
#### Greenness
	"browseUrl": "http://www.visionaplatform.com/api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LMG_20200504T140528/greenness"
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/fcover HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache
		
#### Fcover
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/fcover HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache
		
#### False color
	GET /api/indice/img/1/2020-05-04_S2B_MSIL1C_20200504T132229_N0209_R038_T23LLG_20200504T140528/false_color HTTP/1.1
	Host: www.visionaplatform.com
	Authorization: Basic <access_token>
	Cache-Control: no-cache

### Response

#### NDVI
![NDVI](https://i.imgur.com/r09cBrO.png)