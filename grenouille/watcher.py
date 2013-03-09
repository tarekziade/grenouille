from yocto.api import YAPI
from datetime import datetime

from grenouille.station import Station
from grenouille.database import WeatherDatabase


def watch_station(delay=3600, verbose=True):

    delay = delay * 1000
    station = Station()
    db = WeatherDatabase()

    while True:
        data = {'date': datetime.now()}
        for sensor, value, fmt_value in station.get_info():
            data[sensor.split('.')[-1]] = value

        if verbose:
            print data
        db.index(data)
        YAPI.Sleep(delay)


if __name__ == '__main__':
    watch_station(5)
