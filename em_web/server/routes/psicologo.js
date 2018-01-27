var Psicologo = require('../models/psicologo');
var passport = require('passport');
var passportConfig = require('../config/passport');
'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require('xoauth2');

module.exports = function(app) {

	app.route('/psicologos')
	/* Obtiene a todos los psicologos */
		.get(function(req, res){
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.findAll();
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/psicologo')
	/* Obtiene al psicologo que tiene iniciada la sesion */
		.get(function(req, res){
		setTimeout(function(){
			if(!req.user) {
				res.send(null);
			} else {
				var psicologo = new Psicologo();
				var promise = psicologo.findOne(req.user._id);
				promise.then(
					function(data){
						res.send(data);
					},
					function (error){
						res.status(500).send({error: error});
					}
				);
			}
		}, 50);
	})
	/* Actualiza los datos del psicologo especificado por parametros */
		.put(function(req, res) {
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.update(req.body);
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});


	app.route('/psicologos/:id')
	/* Obtiene al psicologo indicado por parametros */
		.get(function(req, res){
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.findOne(req.params.id);
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/psicologos/filtrar')
	/* Filtra los psicologos mediante los datos del psicologo especificado por parametros */
		.post(function(req, res){
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.filtrar(req.body);
			promise.then(
				function(data){               
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/psicologos/cierre')
	/* Cierra la sesion del psicologo que tiene iniciada la sesion */
		.post(passportConfig.estaAutenticado, function(req, res){
		setTimeout(function(){
			req.session.destroy(function (err) {
				req.logout("Logout exitoso");
				if(err) {
					console.log("Error al cerrar")
				} else {
					console.log("cierro");
					res.redirect(''); //Inside a callback… bulletproof!
				}

			});
		}, 50);
	});

	app.route('/psicologos/registro')
	/* Registra e inicia la sesion del psicologo especificado por parametros */
		.post(function(req, res, next){
		setTimeout(function(){
			//        Como configurar correctamente el correo
			//        https://deivijt.com/blog/como-enviar-emails-con-nodejs-y-nodemailer/
			//		https://thepandeysoni.org/2016/06/12/nodemailer-service-in-node.js-using-SMTP-and-xoauth2/

			console.log(req.body);

			/* Para enviar un email, se define un transporter con los datos de la cuenta de correo */
			//						var transporter = nodemailer.createTransport(smtpTransport ({
			//							service: 'Gmail',
			//							auth: {
			//								XOAuth2 : {
			//									user: 'emozio.info@gmail.com',
			//									clientId : '381129692731-qf67fdfg7p67kq4q862ds4l4bpltv8dq.apps.googleusercontent.com',
			//									clientSecret : 'C2Ugml5YoDI9qbX_s2V_zZzb',
			//									refreshToken : '1/6MPGptIo7bACUTgwqcfUUB2KlAs3tDq3Wrd-ezaYa_o'	
			//								}
			//							}
			//						}));   

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'emozio.info@gmail.com',
					pass: 'Lanocheestrellada'
				}
			});

			//				'<h4> Nombre: </h4><p>' + req.body.nombre +' </p>' + 
			//				'<h4> Edad: </h4><p>' +	req.body.edad +' </p>' +
			//				'<h4> E-mail: </h4><p>' + req.body.email +' </p>' +
			//				'<h4> Localización: </h4><p>' +	req.body.localizacion +' </p>' +
			//				'<h4> Teléfono: </h4><p>' +	req.body.telefono +' </p>' +
			//				'<h4> Número de colegiado: </h4><p>' + req.body.ncolegiado +' </p>' +
			//				'<h4> Experiencia profesional: </h4><p>' + req.body.experiencia +' </p>' +
			//				'<h4> Formación académica: </h4><p>' + req.body.formacion +' </p>' +
			//				'<h4> Terapias que realiza: </h4><p>' +	req.body.terapia +' </p>' +
			//				'<h4> Patologias: </h4><p>' + req.body.patologias +' </p>' +
			//				'<h4> Especialidad: </h4><p>' + req.body.especialidad +' </p>' +

			/* Se define el mail que vamos a enviar */
			var mailOptions = {
				from: 'emozio.info@gmail.com',
				to: 'emozio.info@gmail.com',
				subject: 'Emozio Web - Nuevo psicólogo',
				generateTextFromHTML: true,
				html: '<head><meta name="viewport" content="width=device-width" />'+
				'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
				'<title>Simple Transactional Email</title>'+
				'<style>'+
				'img {'+
				'border: none;'+
				'-ms-interpolation-mode: bicubic;'+
				'max-width: 100%; }'+
				'body {'+
				'	background-color: #f6f6f6;'+
				'	font-family: sans-serif;'+
				'	-webkit-font-smoothing: antialiased;'+
				'	font-size: 14px;'+
				'	line-height: 1.4;'+
				'	margin: 0;'+
				'	padding: 0;'+
				'	-ms-text-size-adjust: 100%;'+
				'		-webkit-text-size-adjust: 100%; }'+
				'table {'+
				'	border-collapse: separate;'+
				'	mso-table-lspace: 0pt;'+
				'	mso-table-rspace: 0pt;'+
				'	width: 100%; }'+
				'table td {'+
				'	font-family: sans-serif;'+
				'	font-size: 14px;'+
				'	vertical-align: top; }'+
				'.body {'+
				'	background-color: #f6f6f6;'+
				'	width: 100%; }'+
				'.container {'+
				'	display: block;'+
				'	Margin: 0 auto !important;'+
				'	max-width: 580px;'+
				'	padding: 10px;'+
				'	width: 580px; }'+
				'.content {'+
				'	box-sizing: border-box;'+
				'	display: block;'+
				'	Margin: 0 auto;'+
				'	max-width: 580px;'+
				'	padding: 10px; }'+
				'.main {'+
				'	background: #ffffff;'+
				'	border-radius: 3px;'+
				'	width: 100%; }'+
				'.wrapper {'+
				'	box-sizing: border-box;'+
				'	padding: 20px; }'+
				'.content-block {'+
				'	padding-bottom: 10px;'+
				'	padding-top: 10px;'+
				'}'+
				'.footer {'+
				'	clear: both;'+
				'	Margin-top: 10px;'+
				'	text-align: center;'+
				'	width: 100%; }'+
				'.footer td,'+
				'	.footer p,'+
				'		.footer span,'+
				'			.footer a {'+
				'				color: #999999;'+
				'				font-size: 12px;'+
				'				text-align: center; }'+
				'h1,'+
				'	h2,'+
				'	h3,'+
				'	h4 {'+
				'		color: #000000;'+
				'		font-family: sans-serif;'+
				'		font-weight: 400;'+
				'		line-height: 1.4;'+
				'		margin: 0;'+
				'		Margin-bottom: 30px; }'+
				'h1 {'+
				'	font-size: 35px;'+
				'	font-weight: 300;'+
				'	text-align: center;'+
				'	text-transform: capitalize; }'+
				'p,'+
				'	ul,'+
				'	ol {'+
				'		font-family: sans-serif;'+
				'		font-size: 14px;'+
				'		font-weight: normal;'+
				'		margin: 0;'+
				'		Margin-bottom: 15px; }'+
				'p li,'+
				'	ul li,'+
				'		ol li {'+
				'			list-style-position: inside;'+
				'			margin-left: 5px; }'+
				'a {'+
				'	color: #3498db;'+
				'	text-decoration: underline; }'+
				'.btn {'+
				'	box-sizing: border-box;'+
				'	width: 100%; }'+
				'.btn > tbody > tr > td {'+
				'	padding-bottom: 15px; }'+
				'.btn table {'+
				'	width: auto; }'+
				'.btn table td {'+
				'	background-color: #ffffff;'+
				'	border-radius: 5px;'+
				'	text-align: center; }'+
				'.btn a {'+
				'	background-color: #ffffff;'+
				'	border: solid 1px #3498db;'+
				'	border-radius: 5px;'+
				'	box-sizing: border-box;'+
				'	color: #3498db;'+
				'	cursor: pointer;'+
				'	display: inline-block;'+
				'	font-size: 14px;'+
				'	font-weight: bold;'+
				'	margin: 0;'+
				'	padding: 12px 25px;'+
				'	text-decoration: none;'+
				'	text-transform: capitalize; }'+
				'.btn-primary table td {'+
				'	background-color: #3498db; }'+
				'		.btn-primary a {'+
				'			background-color: #3498db;'+
				'			border-color: #3498db;'+
				'		color: #ffffff; }'+
				'				.last {'+
				'					margin-bottom: 0; }'+
				'			.first {'+
				'				margin-top: 0; }'+
				'			.align-center {'+
				'				text-align: center; }'+
				'			.align-right {'+
				'				text-align: right; }'+
				'			.align-left {'+
				'				text-align: left; }'+
				'			.clear {'+
				'				clear: both; }'+
				'			.mt0 {'+
				'				margin-top: 0; }'+
				'			.mb0 {'+
				'				margin-bottom: 0; }'+
				'			.preheader {'+
				'				color: transparent;'+
				' 			display: none;'+
				'				height: 0;'+
				'				max-height: 0;'+
				'				max-width: 0;'+
				'				opacity: 0;'+
				'				overflow: hidden;'+
				'				mso-hide: all;'+
				'				visibility: hidden;'+
				'				width: 0; }'+
				'			.powered-by a {'+
				'				text-decoration: none; }'+
				'			hr {'+
				'				border: 0;'+
				'				border-bottom: 1px solid #f6f6f6;'+
				'				Margin: 20px 0; }'+
				'			@media only screen and (max-width: 620px) {'+
				'				table[class=body] h1 {'+
				'					font-size: 28px !important;'+
				'					margin-bottom: 10px !important; }'+
				'				table[class=body] p,'+
				'					table[class=body] ul,'+
				'						table[class=body] ol,'+
				'						table[class=body] td,'+
				'								table[class=body] span,'+
				'									table[class=body] a {'+
				'										font-size: 16px !important; }'+
				'				table[class=body] .wrapper,'+
				'					table[class=body] .article {'+
				'						padding: 10px !important; }'+
				'				table[class=body] .content {'+
				'					padding: 0 !important; }'+
				'				table[class=body] .container {'+
				'					padding: 0 !important;'+
				'					width: 100% !important; }'+
				'				table[class=body] .main {'+
				'					border-left-width: 0 !important;'+
				'					border-radius: 0 !important;'+
				'					border-right-width: 0 !important; }'+
				'				table[class=body] .btn table {'+
				'					width: 100% !important; }'+
				'				table[class=body] .btn a {'+
				'					width: 100% !important; }'+
				'				table[class=body] .img-responsive {'+
				'					height: auto !important;'+
				'					max-width: 100% !important;'+
				'					width: auto !important; }}'+
				'			@media all {'+
				'				.ExternalClass {'+
				'					width: 100%; }'+
				'				.ExternalClass,'+
				'					.ExternalClass p,'+
				'						.ExternalClass span,'+
				'							.ExternalClass font,'+
				'							.ExternalClass td,'+
				'									.ExternalClass div {'+
				'										line-height: 100%; }'+
				'				.apple-link a {'+
				'					color: inherit !important;'+
				'					font-family: inherit !important;'+
				'					font-size: inherit !important;'+
				'					font-weight: inherit !important;'+
				'					line-height: inherit !important;'+
				'					text-decoration: none !important; }'+
				'				.btn-primary table td:hover {'+
				'					background-color: #34495e !important; }'+
				'						.btn-primary a:hover {'+
				'							background-color: #34495e !important;'+
				'							border-color: #34495e !important; } }'+
				'								</style>'+
				'							</head>'+
				'							<body class="">'+
				'								<table border="0" cellpadding="0" cellspacing="0" class="body">'+
				'									<tr>'+
				'									<td>&nbsp;</td>'+
				'							<td class="container">'+
				'								<div class="content">'+
				'						<!-- START CENTERED WHITE CONTAINER -->'+
				'							<span class="preheader">'+req.body.nombre+'</span>'+
				'							<table class="main">'+
				'								<!-- START MAIN CONTENT AREA -->'+
				'							<tr>'+
				'									<td class="wrapper">'+
				'										<table border="0" cellpadding="0" cellspacing="0">'+
				'											<tr>'+
				'											<td>'+
				'<table style="width:100%">' +
				'<tr>' +
				'<th style="text-align: left;">Nombre</th>' +
				'<td>' + req.body.nombre +'</td> ' +
				'</tr>' +
				'<tr>' +
				'<th style="text-align: left;">Edad</th>' +
				'<td>' + req.body.edad +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">E-mail</th>' +
				'<td>' +  req.body.email +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Localización</th>' +
				'<td>' +  req.body.localizacion +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Teléfono</th>' +
				'<td>' + req.body.telefono +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Número de colegiado</th>' +
				'<td>' +  req.body.ncolegiado +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Experiencia profesional</th>' +
				'<td>' +  req.body.experiencia +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Formación académica</th>' +
				'<td>' + req.body.formacion +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Terapias que realiza</th>' +
				'<td>' +  req.body.terapia +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Patologias</th>' +
				'<td>' +  req.body.patologias +'</td> ' +
				'</tr>' +
				'<tr> ' +
				'<th style="text-align: left;">Especialidad</th>' +
				'<td>' +  req.body.especialidad +'</td> ' +
				'</tr>' +
				'</table>' +
				//				'							<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">'+
				//				'								<tbody>'+
				//				'								<tr>'+
				//				'								<td align="left">'+
				//				'									<table border="0" cellpadding="0" cellspacing="0">'+
				//				'										<tbody>'+
				//				'										<tr>'+
				//				'										<td> <a href="http://htmlemail.io" target="_blank">Call To Action</a> </td>'+
				//				'											</tr>'+
				//				'							</tbody>'+
				//				'							</table>'+
				'							</td>'+
				'						</tr>'+
				'							</tbody>'+
				'							</table>'+
//				'							<p>This is a really simple email template. Its sole purpose is to get the recipient to click the button with no distractions.</p>'+
//				'							<p>Good luck! Hope it works.</p>'+
				'							</td>'+
				'							</tr>'+
				'							</table>'+
				'							</td>'+
				'							</tr>'+
				'										<!-- END MAIN CONTENT AREA -->'+
				'										</table>'+
				'										<!-- START FOOTER -->'+
				'										<div class="footer">'+
				'											<table border="0" cellpadding="0" cellspacing="0">'+
				'												<tr>'+
				'												<td class="content-block">'+
				//'													<span class="apple-link">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>'+
				//'										<br> Dont like these emails? <a href="">Unsubscribe</a>'+
				'										<span class="apple-link">El equipo de Emozio</span>'+
				'										</td>'+
				'										</tr>'+
				//				'										<tr>'+
				//				'										<td class="content-block powered-by">'+
				//				'												Powered by <a href="http://htmlemail.io">HTMLemail</a>'+
				//				'										</td>'+
				//				'										</tr>'+
				'										</table>'+
				'										</div>'+
				'										<!-- END FOOTER -->'+
				'										<!-- END CENTERED WHITE CONTAINER -->'+
				'										</div>'+
				'										</td>'+
				'										<td>&nbsp;</td>'+
				'										</tr>'+
				'										</table>'+
				'										</body>'
				//            text: JSON.stringify(req.body)
			};

			// Se envia el mail
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
				// Preview only available when sending through an Ethereal account
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			});
		}, 50);		
	});

	app.route('/psicologos/baja')
	/* Da de baja y cierra la sesion del psicologo que tiene iniciada la sesion */
		.post(function(req, res){
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.darBaja(req.user._id);
			promise.then(
				function(){
					console.log("Elimino la cuenta");
					req.session.destroy(function (err) {
						req.logout("Logout exitoso");
						if(err) {
							console.log("Error al cerrar")
						} else {
							console.log("Cierro la sesion");
							res.redirect('inicio'); //Inside a callback… bulletproof!
						}

					});
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/psicologos/comentarios')
	/* Guarda los comentarios y respuestas del psicologo que tiene iniciada la sesion*/
		.put(function(req, res){
		setTimeout(function(){
			var psicologo = new Psicologo();
			var promise = psicologo.updateComentarios(req.body);
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

};