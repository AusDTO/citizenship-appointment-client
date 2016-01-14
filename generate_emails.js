
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


const email_templates = [
	{
		"name": "invitation_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToBase64("angle_icon.png"),
			headerText: "Invitation to book your citizenship appointment"
		}
	},
	{
		"name": "confirmation_template",
		"template_name": "confirmation_template",
		"data": {
			locationIcon: convertImageToBase64("location_icon.png"),
			calendarIcon: convertImageToBase64("calendar_icon.png")
		}
	},
	{
		"name": "reminder_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToBase64("angle_icon.png"),
			headerText: "Reminder to book your citizenship appointment"
		}
	},
	{
		"name": "noshow_template",
		"template_name": "invitation_template",
		"data": {
			angleIcon: convertImageToBase64("angle_icon.png"),
			headerText: "You have missed your appointment. Please book your next citizenship appointment"
		}
	},
	{
		"name": "lastchance_template",
		"template_name": "lastchance_template",
		"data": {
			angleIcon: convertImageToBase64("angle_icon.png")
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

function getImagesForMainTemplate(){
	return {
		headerLogo: convertImageToBase64("aust-govt-black-on-transparent-247x60.png"),
		passportIcon: convertImageToBase64("passport.png"),
		birthCertificateIcon: convertImageToBase64("id-verified.png"),
		documentWithPhotoIcon: convertImageToBase64("license.png"),
		residentialAddressIcon: convertImageToBase64("exterior.png"),
		certificateIcon: convertImageToBase64("certificate-2.png"),
		formIcon: convertImageToBase64("file.png"),
		policeCheckIcon: convertImageToBase64("badge.png"),
		smallCertificateIcon: convertImageToBase64("certificate.png"),
		playIcon: convertImageToBase64("play_icon.png"),
		pdfIcon: convertImageToBase64("pdf_icon.png"),
		checkIcon: convertImageToBase64("check_icon.png")
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