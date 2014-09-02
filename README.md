Open Challenge
========

Open and easy to configure challenge platform

Requirements
=============
* MongoDB
* NodeJS
* NPM

Install
===========
	git clone https://github.com/gcba/open-challenge.git
	cd open-challenge
	cp keys.json.sample keys.json
	cp config.json.sample config.json
	npm install
	node server.js

Config
======

In your `config.json`:

* `db`:
	+ `url`: Overrides other db config. Full MongoDB URL.
	+ `host`
	+ `port`
* `host`: Your instance host (i.e. yourdomain.com)
* `port`: Your port (i.e. 3000)
* `session`: Your session key (it must be a secret string)
* `title`: Instance title used in the html title tag and other headings.
* `live`: Boolean (true, false) that enable/disable the live feed feature in yourdomain.com/live.
* `mailer`: SMTP mail info to enable email notifications using nodemailer. Check out the [options](https://github.com/andris9/Nodemailer#setting-up-smtp)


In your `keys.json`:

* `openid`:
  + `returnURL`: Url to return after authentication,
  + `realm`: Indicates the part of URL-space for which authentication is valid,
  + `providerURL`: Url of any valid openid provider,

Running instances
=================

* http://concursos.buenosaires.gob.ar

Copyleft
========

Based in the [HackDash platform](http://hackdash.org)
Developed by the Gobierno de la Ciudad de Buenos Aires
