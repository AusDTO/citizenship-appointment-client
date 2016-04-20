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
const dest_environment = "https://appointments.border.gov.au/";
const google_analitics_trackingId = "UA-72722909-1";

const appointment_types = [
	{
		"appointmentInformation": compileTemplate("citizenship_test_template.mustache"),
		"data": {
			appointmentType: "Australian citizenship interview and test (standard)",
			hasTest: true,
			campaignName: "standard"
		},
		"name": "_standard"
	},
	{
		"appointmentInformation": compileTemplate("citizenship_test_template.mustache"),
		"data": {
			appointmentType: "Australian citizenship interview and test (assisted)",
			hasTest: true,
			campaignName: "assisted",
      isAssisted: true
		},
		"name": "_assisted"
	},
	{
		"appointmentInformation": compileTemplate("citizenship_interview_template.mustache"),
		"data": {
			appointmentType: "Australian citizenship interview",
			hasTest: false,
			campaignName: "interviewOnly"
		},
		"name": "_interviewOnly"
	}
];

const email_templates = [
	{
		"name": "invitation",
		"template_name": "invitation_template",
		"data": {
			headerText: "Invitation to book your citizenship appointment",
			hasArriveInfo: false,
			campaignSource: "invitation_email"

		}
	},
	{
		"name": "confirmation",
		"template_name": "confirmation_template",
		"data": {
      headerText: "Your citizenship appointment has been scheduled",
			hasArriveInfo: true,
			campaignSource: "confirmation_email"
		}
	},
	{
		"name": "reminder",
		"template_name": "invitation_template",
		"data": {
			headerText: "Reminder to book your citizenship appointment",
			hasArriveInfo: false,
			campaignSource: "reminder_email"
		}
	},
	{
		"name": "noshow",
		"template_name": "noshow_template",
		"data": {
			headerText: "You have missed your appointment",
			hasArriveInfo: false,
			campaignSource: "noshow_email",
      hideBookingInfo: true
		}
	}
];

generateTemplates();

function generateTemplates(){
	var mainTemplateData = getImagesForMainTemplate(),
		mainBodyTemplate = compileTemplate("main_body.mustache");

	email_templates.forEach(function(template) {
		appointment_types.forEach(function(appointmentType){
			var extendedTemplate = mergeTemplateConfig(template, appointmentType);

			var compiledTemplate = compileTemplate(extendedTemplate.template_name + ".mustache");
			var templateData = mergeObjects(mainTemplateData, extendedTemplate.data);

			var fullTemplate = mainBodyTemplate.render(templateData, {
				content: compiledTemplate,
        what_happens: compileTemplate('what_happens_template.mustache'),
        what_to_bring: compileTemplate('what_to_bring_template.mustache'),
        when_you_arrive: compileTemplate('when_you_arrive_template.mustache'),
        what_happens_after: compileTemplate('what_happens_after_template.mustache'),
        personal_identifiers: compileTemplate('personal_identifiers_template.mustache'),
        changes_to_circumstances: compileTemplate('changes_to_circumstances_template.mustache'),
        contact_us: compileTemplate('contact_us_template.mustache'),
				appointmentInformation: extendedTemplate.appointmentInformation
			});
			fs.writeFileSync(path.join(outputDir, extendedTemplate.name + ".html"), fullTemplate);
		});
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
		headerLogo: convertImageToHostedSrc("aust-govt-black-on-transparent.png"),
		playIcon: convertImageToHostedSrc("play_icon.png"),
		pdfIcon: convertImageToHostedSrc("pdf_icon.png"),
		checkIcon: convertImageToHostedSrc("check_icon.png"),
		websiteLink: dest_environment,
		gaTrackingId: google_analitics_trackingId
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

function mergeTemplateConfig(templateConfig, appointmentTypeData){
	var data = mergeObjects(templateConfig.data, appointmentTypeData.data);
	var name = templateConfig.name + appointmentTypeData.name;
	var mergedConfig = mergeObjects(templateConfig, appointmentTypeData);
	mergedConfig.data = data;
	mergedConfig.name = name;
	return mergedConfig;
}
