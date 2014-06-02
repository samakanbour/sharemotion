from django.db import models

class TwitterUser(models.Model):
	name = models.CharField(max_length=200, primary_key=True)
	url = models.CharField(max_length=200)
	finalToken = models.CharField(max_length=200)
	finalSecret = models.CharField(max_length=200)

class UserKey(models.Model):
	User = models.CharField(max_length=200)
	Token = models.CharField(max_length=200)
	Secret = models.CharField(max_length=200)

class TwitterAuth(models.Model):
	aToken = models.CharField(max_length=200)
	aSecret = models.CharField(max_length=200)