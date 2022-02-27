#!/usr/bin/python3
## SCRIPT TO MANAGE DEVELPMENT
from sys import path
path.append("management/reusing")

from argparse import ArgumentParser
from github import download_from_github
from os import remove

parser=ArgumentParser()

group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--reusing', help='It gets all reused files downloading from Internet and updates them for this project', action="store_true", default=False)
group.add_argument('--reusing_only_local', help='It updates downloaed files for this project', action="store_true", default=False)

args=parser.parse_args()

if args.reusing==True:
    download_from_github("turulomio", "reusingcode", "python/github.py", "management/reusing")
    download_from_github("turulomio", "reusingcode", "python/file_functions.py", "management/reusing")
    download_from_github("turulomio", "reusingcode", "vue/components/ChartPie.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/MyDatePicker.vue", "src/components/reusing")
    download_from_github("turulomio", "reusingcode", "vue/components/AutoCompleteApiOneField.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/DisplayValues.vue", "src/components/reusing")
    download_from_github("turulomio", "moneymoney", "src/components/MyMenuInline.vue", "src/components/reusing")
