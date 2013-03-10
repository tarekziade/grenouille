# -* encoding: utf8 -*-
#
from yocto.api import YAPI, YModule, YRefParam
from yocto.humidity import YHumidity
from yocto.temperature import YTemperature
from yocto.pressure import YPressure

TURCEY = 374.


def convert_pressure(value, altitude=TURCEY):
    # XXX we should find out the altitude, given the box IP
    return value + value / 8.3 * 100. / 100.


class Station(object):

    def __init__(self, target=None):
        errmsg = YRefParam()

        if YAPI.RegisterHub("usb", errmsg) != YAPI.SUCCESS:
            raise IOError("init error" + errmsg.value)

        self.target = target
        if target is not None:
            self._module = YModule.FindModule(target)
        else:
            sensor = YHumidity.FirstHumidity()
            if sensor is None:
                raise IOError('No module connected')
            self._module = sensor.get_module()
            self.target = target = self._module.get_serialNumber()

        self._sensors = [YHumidity.FindHumidity(target+'.humidity'),
                         YPressure.FindPressure(target+'.pressure'),
                         YTemperature.FindTemperature(target+'.temperature')]

    def _format_value(self, sensor):
        value = sensor.get_currentValue()
        name = sensor.get_friendlyName()

        if isinstance(sensor, YHumidity):
            return name, value, u'%4.0f%%' % value
        elif isinstance(sensor, YPressure):
            value = convert_pressure(value)
            return name, value, u'%4.0fmb' % value
        else:
            return name, value, u'%2.1fºC' % value

    def get_info(self, formatted=False):
        if not self._module.isOnline():
            raise IOError('Device not connected')

        return [self._format_value(sensor) for sensor in self._sensors]
