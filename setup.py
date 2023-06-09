from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

get version from __version__ variable in gama/__init__.py
from gama import __version__ as version

setup(
	name="Gama",
	version=version,
	description="Gama Reklam San. ve Tic. A.Ş. ERPNext Customization",
	author="Gama Reklam San. ve Tic. A.Ş.",
	author_email="administrator@gamareklam.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
