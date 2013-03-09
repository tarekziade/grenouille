# -*- encoding: utf8 -*-
import os
import sys
from setuptools import setup, find_packages


setup(name='grenouille',
      version='0.1',
      packages=find_packages(),
      description="Station Meteo",
      author="Tarek Ziadé",
      author_email="tarek@ziade.org",
      include_package_data=True,
      install_requires=['yocto', 'pyelasticsearch'],
      zip_safe=False
      )
