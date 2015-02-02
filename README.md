Open Challenge BA
========

**Open and easy to configure challenge platform**

Buenos Aires City Government releases Open Challenge BA, the first open source challenge platform available for cities and organizations.


**Plataforma de concursos y desafíos abierta para Gobiernos y Organizaciones**

Desde la Dirección de Gobierno Electrónico de la Ciudad de Buenos Aires creamos Open Challenge BA (beta 1), la primera plataforma de concursos open source, disponible para ser reutilizada por cualquier ciudad y organización.

La plataforma nació como un fork (subproyecto) de la plataforma de proyectos para hackatons llamada HackDash, una plataforma de código libre desarrollada por Dan Zajdband para Hack Hackers Media Party.

Open Challenge BA permite a una organización (ciudad, estados, ONGs) crear concursos compartiendo módulos, usuarios y manteniendo una administración descentralizada.


Requirements
=============
* MongoDB
* NodeJS
* NPM

Install
===========
<<<<<<< HEAD
	git clone https://github.com/gcba/open-challenge.git
	cd open-challenge
	cp keys.json.sample keys.json
	cp config.json.sample config.json
	npm install
	node server.js
=======

I wrote a [blog post](http://zajdband.com/installing-hackdash) explaining the installation process.
>>>>>>> FETCH_HEAD

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
* `prerender`: 
	+ `enabled`: Boolean (true, false). Where the website would use the SEO Prerender 
	+ `db`: The Mongo URI of Cached Pages.


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

<<<<<<< HEAD
Based in the [HackDash platform](http://hackdash.org)
Developed by [Gobierno de la Ciudad de Buenos Aires](http://www.buenosaires.gob.ar)
=======
Add your own Dashboard!


Contribute
==========

### Install GruntJS
[GruntJS](http://gruntjs.com/) is required.

```bash
npm install -g grunt-cli
```

### Create a configuration file
Create a `config.test.json` file using the config.json.sample with the configuration of your local for test. (i.e. mongoDB url for tests)

### Running Tests
```bash
npm install
npm test
```

or 

```bash
grunt test
```
>>>>>>> FETCH_HEAD
