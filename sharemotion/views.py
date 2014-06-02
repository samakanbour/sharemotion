from django import forms
from django.core import serializers
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.utils.html import strip_tags
from django.views.decorators.csrf import csrf_exempt
from sharemotion.models import *
from twython import Twython
import json
import twitter

cKey = 'P1vjriSUOv3bidZa97OixQ'
cSecret = 'xDLMVDxOm2pLRrMITUgfQPaatVADEZljD8oRrZ2c'

@csrf_exempt
def index(request, name = None):
	if name:
		user = TwitterUser.objects.get(name = name)
		return render(request,'sharemotion/index.html', {'user': user})
	else:
		return render(request,'sharemotion/index.html')

@csrf_exempt
def signOut(request):
	return index(request)

@csrf_exempt
def signIn(request):
	twitter = Twython(cKey,cSecret)
	auth = twitter.get_authentication_tokens(callback_url='http://127.0.0.1/sharemotion/authenticate')
	aToken = auth['oauth_token']
	aSecret = auth['oauth_token_secret']
	url = auth['auth_url']
	Auth = TwitterAuth(aToken = aToken, aSecret = aSecret)
	Auth.save()
	return HttpResponseRedirect(url)

@csrf_exempt
def authenticate(request):
	verifier = request.GET['oauth_verifier']
	authToken = request.GET['oauth_token']
	tokens = TwitterAuth.objects.get(aToken = authToken)
	aToken = authToken
	aSecret = tokens.aSecret
	tokens.delete()

	twitter = Twython(cKey, cSecret,aToken, aSecret)
	final_step = twitter.get_authorized_tokens(verifier)
	finalToken = final_step['oauth_token']
	finalSecret = final_step['oauth_token_secret']

	### here we will extract user information from Twitter, and save it to database with tokens.
	authorizedTwitter = Twython(cKey, cSecret, finalToken, finalSecret)
	userinfo = authorizedTwitter.verify_credentials()
	name = userinfo['screen_name']
	url = userinfo['profile_image_url']
	user = TwitterUser(	name = name,\
						url = url,\
  						finalToken = finalToken,\
  						finalSecret = finalSecret)
	try:
		user.save()
		return index(request, name)
	except:
		return index(request, name)

@csrf_exempt
def post(request):
	user = TwitterUser.objects.get(name = request.GET['name'])
	aToken = user.finalToken
	aSecret = user.finalSecret
	comment = request.GET['comment']
	feeling = request.GET['feeling']
	status = comment + ' - feeling ' + feeling + ' by www.sharemotion.net'
	twitter = Twython(cKey, cSecret, aToken, aSecret)
	try:
		twitter.update_status(status=status)
		message = ''
	except:
		message = 'There was an error posting your comment...'	
	return HttpResponse(json.dumps({'message':message}), mimetype="application/json")

def find(request):
	query = request.GET['query']
	userlist = list(TwitterUser.objects.filter(name__contains = query).values_list('id', flat=True))
	entry_list = TwitterUser.objects.filter(id__in=userlist)
	result = []
	for entry in entry_list:
		result.append({'id': entry.id, 'name': entry.name, 'imageurl': entry.url})
	return HttpResponse(json.dumps(result), mimetype='application/json')