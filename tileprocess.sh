#!/bin/bash
# this bash is responsible for downloading geotiff files for a farm, merging them into single geotif file
# then it will use gdal2tiles to create tiles for the merged area and then upload the tile files to gcloud
# finally the script will create an new entry in the imaging table for the farm
# TODO the suggestion is to move this script to a cloud-based service

if [[ $# -lt 2 ]] ; then
    echo 'Help: Call sudo bash ./tileprocess.sh <farm-id> <storage-date-path> [-i]'
	echo 'Optional: -i, if used will enable interactive mode, where each processeing will ask to be executed.'
	echo 'Where: <farm-id> is a number representing the id of the farm registered on agrox database'
	echo 'Where: <storage-date-path> is the sub-path at the storage where the geotiff images will be read from. Usually is a date in format YYYY-MM-DD.'
	echo 'Example: sudo bash ./tileprocess.sh 1 2021-2-19'
    exit 1
fi

FARMID=$1
DATE=$2
INTERACTIVE=$3
TIFFBUCKET=agroxdev-field-images
TILESBUCKET=agroexplore-field-maps
TEMPPATH=$PWD/../tmp
GDALPATH=/usr/bin
CURRENTANS='y'

echo
echo "Processing the GeoTiffs in the storage bucket: $TIFFBUCKET/$FARM/$DATE"
echo $TEMPPATH
mkdir $TEMPPATH
cd $TEMPPATH
echo
echo "=================== DOWNLOAD SOURCE TIF FILES FROM GCLOUD ==================="
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Download GeoTif from Gcloud ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
[[ $CURRENTANS == 'y' ]] && gsutil -m cp gs://$TIFFBUCKET/farm-id-$FARMID/$DATE/*.tif .
echo "=================== COMPRESS SOURCE TIF FILES  ==================="
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Compress GeoTif files ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
for file in *.tif; do
	[[ $CURRENTANS == 'y' ]] && gdal_translate -co COMPRESS=JPEG "$file" "comp_$file"
	[[ $CURRENTANS == 'y' ]] && rm "$file"
done
echo "=================== MERGE COMPRESSED SOURCE TIF FILES INTO ONE TIF ==================="
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Merge Compressed GeoTif files ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
[[ $CURRENTANS == 'y' ]] && gdalwarp -t_srs EPSG:4326 -wo NUM_THREADS=val/ALL_CPUS -multi *.tif farm-id-$FARMID.tif
echo "=================== CREATE TILES FROM MERGED FILE ==================="
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Create Tiles files ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
[[ $CURRENTANS == 'y' ]] && python3 $GDALPATH/gdal2tiles.py -p mercator farm-id-$FARMID.tif
echo "=================== UPDLOAD TILES TO GCLOUD ==================="
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Upload Tiles to Gcloud ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
[[ $CURRENTANS == 'y' ]] && gsutil -m cp -r farm-id-$FARMID gs://$TILESBUCKET/farm-id-$FARMID/$DATE
echo "=========================================================================="
echo "TILES have been processed and Moved to the gcloud storage!"
echo "=========================================================================="
echo
echo "=================== CLEANUP - REMOVE LOCAL IMAGE FILES ==================="
cd ..
rm -r $TEMPPATH
echo
echo "=================== CALL NODE MODULE TO UPDATE DATABASE ==================="
# this files should be at /opt path with a single line containing the DB URL
DB_URL_PROD=(`cat "env_db_prod"`)
DB_URL_DEV=(`cat "env_db_dev"`)
export AGROX_DB_URL_LOCAL="$DB_URL_PROD"
export AGROX_DB_DEV_URL_LOCAL="$DB_URL_DEV"

cd agro-x
# call node script to publish the new tiles to the farm
if [[ $INTERACTIVE == '-i' ]] ; then
echo -n "Create Database Entries ? [y/n]: "
read -n 1 CURRENTANS
fi
echo
[[ $CURRENTANS == 'y' ]] && node tileprocess.js $FARMID $DATE
echo
echo "=================== END OF SCRIPT ==================="
