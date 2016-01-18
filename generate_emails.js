#!/usr/bin/env node

'use strict';

const hogan = require('hogan.js'),
      fs = require('fs'),
      path = require('path'),
      util = require('util'),
      mime = require('mime');

const baseDir = path.join(__dirname, 'email_templates');
const templateDir = path.join(baseDir, 'partials');
const outputDir = path.join(baseDir, 'generated');
const imagesDir = path.join(__dirname, 'images', 'email_templates');
const dest_environment = "https://citizenship-appointment-beta.cfapps.io/";


const email_templates = [
	{
		"name": "invitation_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToHostedSrc("angle_icon.png"),
			headerText: "Invitation to book your citizenship appointment",
			websiteLink: dest_environment
		}
	},
	{
		"name": "confirmation_template",
		"template_name": "confirmation_template",
		"data": {
			locationIcon: convertImageToHostedSrc("location_icon.png"),
			calendarIcon: convertImageToHostedSrc("calendar_icon.png"),
			websiteLink: dest_environment
		}
	},
	{
		"name": "reminder_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToHostedSrc("angle_icon.png"),
			headerText: "Reminder to book your citizenship appointment",
			websiteLink: dest_environment
		}
	},
	{
		"name": "noshow_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToHostedSrc("angle_icon.png"),
			headerText: "You have missed your appointment. Please book your next citizenship appointment",
			websiteLink: dest_environment
		}
	},
	{
		"name": "lastchance_template",
		"template_name": "lastchance_template",
		"data": {
			angleIcon: convertImageToHostedSrc("angle_icon.png"),
			websiteLink: dest_environment
		}
	}
];

generateTemplates();

function generateTemplates(){
	var mainTemplateData = getImagesForMainTemplate(),
		mainBodyTemplate = compileTemplate("main_body.mustache");

	email_templates.forEach(function(template) {
		var compiledTemplate = compileTemplate(template.template_name + ".mustache");
		var templateData = mergeObjects(mainTemplateData, template.data);

		var fullTemplate = mainBodyTemplate.render(templateData, {content: compiledTemplate});
			fs.writeFileSync(path.join(outputDir, template.name + ".html"), fullTemplate);
	});
};

function compileTemplate(templateName){
	return hogan.compile(fs.readFileSync(path.join(templateDir, templateName), 'utf8'));
}

function convertImageToBase64(fileName) {
	var filePath = path.join(imagesDir, fileName);
    var data = fs.readFileSync(filePath).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(filePath), data);
}

function convertImageToHostedSrc(fileName){
	return dest_environment + "images/" + fileName;
}

function getImagesForMainTemplate(){
	return {
		headerLogo: convertImageToHostedSrc("aust-govt-black-on-transparent-247x60.png"),
		passportIcon: convertImageToHostedSrc("passport.png"),
		birthCertificateIcon: convertImageToHostedSrc("id-verified.png"),
		documentWithPhotoIcon: convertImageToHostedSrc("license.png"),
		residentialAddressIcon: convertImageToHostedSrc("exterior.png"),
		certificateIcon: convertImageToHostedSrc("certificate-2.png"),
		formIcon: convertImageToHostedSrc("file.png"),
		policeCheckIcon: convertImageToHostedSrc("badge.png"),
		smallCertificateIcon: convertImageToHostedSrc("certificate.png"),
		playIcon: convertImageToHostedSrc("play_icon.png"),
		pdfIcon: convertImageToHostedSrc("pdf_icon.png"),
		checkIcon: convertImageToHostedSrc("check_icon.png")
	};
}

function mergeObjects(target, source){
	var result = {};
    for(var prop in source){
        result[prop] = source[prop];
    }
    for(var prop in target){
        result[prop] = target[prop];
    }
    return result;
}
