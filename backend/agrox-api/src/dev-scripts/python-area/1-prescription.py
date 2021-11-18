from openpyxl import load_workbook
from openpyxl.drawing.image import Image
from openpyxl.worksheet.datavalidation import DataValidation
import json
import sys
import dateutil.parser
from subprocess import call
import os

inputFile = sys.argv[1]
outputFile = sys.argv[2]

AT = {
    'field_img': 'A10',
    'legend_img': 'A28',
    'id': 'B28',

    'lat': 'C8',
    'long': 'D8',

    'area': 'A6',
    'name': 'A5',
    'area_ha': 'C12',
    'affected_area_ha': 'D12',

    'crop_type': 'C16',
    'variety': 'D16',
    'number': 'E16',
    'sowing_date': 'C19',
    'expected_harvest_date': 'D19',

    'trepadeira': 'C23',
    'gpa': 'D23',
    'gpb': 'E23',
    'mamona': 'C26',
    'ofl': 'D26',
    'indefinida': 'E26',
    'report_date': 'C29',

    'author': 'B1',
    'whatsapp': 'B2',
    'modal': 'J2',
}

# Read JSON
with open(inputFile, encoding='utf-8') as f:
    areas = json.load(f)

# Read existing workbook
template_wb = load_workbook(filename='prescription_template.xlsx')

isFirst = True
firstSheetName = ''
farmName = ''

# add combo box with values
dv = DataValidation(type="list", formula1='"drone,avião"', allow_blank=True)

# Grab the template worksheet
template_sheet = template_wb['template']
for area in areas:
    farmName = area['farm_name']
    for field in area['fields']:
        # Create a copy of the template sheet
        copy = template_wb.copy_worksheet(template_sheet)
        # Add sheet title and name
        copy.title = field['name']

        if isFirst is True:
            isFirst = False
            firstSheetName = copy.title
        elif not isFirst:
            copy[AT['author']] = "=('{0}'!{1})".format(firstSheetName, AT['author'])
            copy[AT['whatsapp']] = "=('{0}'!{1})".format(firstSheetName, AT['whatsapp'])

        copy.add_data_validation(dv)
        dv.add(copy[AT['modal']])

        # Add field data
        copy[AT['lat']] = field['lat']
        copy[AT['long']] = field['long']
        copy[AT['id']] = field['diagnosis']['id']

        copy[AT['area']] = area['name']
        copy[AT['name']] = field['name']
        copy[AT['area_ha']] = field['infestation']['area_ha']
        copy[AT['affected_area_ha']] = field['infestation']['affected_area_ha']

        copy[AT['crop_type']] = field['crop']['crop_type']
        copy[AT['variety']] = field['crop']['variety']
        copy[AT['number']] = field['crop']['number']

        copy[AT['sowing_date']] = dateutil.parser.parse(field['crop']['sowing_date'])
        copy[AT['expected_harvest_date']] = dateutil.parser.parse(field['crop']['expected_harvest_date'])
        copy[AT['report_date']] = dateutil.parser.parse(area['report_date'])

        if 'trepadeira' in field['diagnosis']:
            copy[AT['trepadeira']] = field['diagnosis']['trepadeira']
        if 'gpa' in field['diagnosis']:
            copy[AT['gpa']] = field['diagnosis']['gpa']
        if 'gpb' in field['diagnosis']:
            copy[AT['gpb']] = field['diagnosis']['gpb']
        if 'mamona' in field['diagnosis']:
            copy[AT['mamona']] = field['diagnosis']['mamona']
        if 'ofl' in field['diagnosis']:
            copy[AT['ofl']] = field['diagnosis']['ofl']
        if 'indefinida' in field['diagnosis']:
            copy[AT['indefinida']] = field['diagnosis']['indefinida']

        # Adding images
        try:
            path = os.path.join(os.path.dirname(inputFile), str(field['id']) + '.jpg')

            # stretch image to fit the image box on the spreadsheet
            img = Image(path)
            # dpi = img.info['dpi'] # this does not work, so use a dpi value of 96
            # the box have 9.50 cm x 12 cm size
            img.height = 9.5 * 96 / 2.54
            img.width = 12 * 96 / 2.54
            copy.add_image(img, AT['field_img'])
        except Exception as error:
            print(error)


        legend = Image('template.jpg')
        copy.add_image(legend, AT['legend_img'])
        copy.protection.enable()
        copy.protection.set_password('embraer@atech')


# Remove the template sheet
del template_wb['template']

# use a more recognizable name for the file
newName = '\\Prescrição_{0}.xlsx'.format(farmName.replace(' ', '_'))
pathLastIndex = outputFile.rfind('\\')
outputFile =  outputFile[0:pathLastIndex] + newName

# Save the file
template_wb.save(outputFile)
