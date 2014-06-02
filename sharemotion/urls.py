from django.conf.urls.defaults import patterns, url
from sharemotion import views

urlpatterns = patterns('sharemotion.views',
    url(r'^$', 'index'),
    url(r'^signout/$', 'signOut'),
    url(r'^signin/$', 'signIn'),
    url(r'^authenticate/$', 'authenticate'),
    url(r'^post/$', 'post')
)