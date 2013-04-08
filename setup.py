# -*- encoding: utf8 -*-
import os
import sys

from setuptools import setup, find_packages
from grenouille import __version__


setup(name='grenouille',
      version=__version__,
      packages=find_packages(),
      description="Station Meteo",
      author="Tarek Ziadé",
      author_email="tarek@ziade.org",
      include_package_data=True,
      install_requires=['yoctopuce', 'pyelasticsearch',
                        'BeautifulSoup', 'requests'],
       entry_points="""
      [console_scripts]
      grenouille = grenouille.watcher:main
      """,
      zip_safe=False
      )
