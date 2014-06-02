import os, sys

sys.path.append('C:/Users/TOSH/Desktop/sharemotion')
os.environ['DJANGO_SETTINGS_MODULE'] = 'samak.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()