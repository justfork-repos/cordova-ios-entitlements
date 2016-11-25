var path = require('path');
var fs = require('fs');
var xcodeHelpers = require('./lib/xcode-helpers');
var preferencesParser = require('./lib/preferences-parser');

module.exports = function(ctx) {
  glob = ctx.requireCordovaModule('glob');
  xcode = ctx.requireCordovaModule('xcode');
  var projectRoot = ctx.opts.projectRoot;
  var configXml = path.join(projectRoot, 'config.xml');
  var preferences = preferencesParser.parseConfigXml(configXml);
  var entitlementsSrcFile = preferences['cordova-ios-entitlements-file'];
  if (!entitlementsSrcFile) {
    console.error('cordova-ios-entitlements: preference "cordova-ios-entitlements-file" must be set');
    return;
  }
  var entitlementsContent = fs.readFileSync(path.join(projectRoot, entitlementsSrcFile),'utf8');

  var cordovaIosProjectPath = path.join(projectRoot, 'platforms', 'ios');
  var pbxprojFile = glob.sync(path.join(cordovaIosProjectPath, '*.xcodeproj', 'project.pbxproj'))[0];
  var xcodeProjectFolderPath = path.dirname(pbxprojFile);
  var xcodeProjectFolderName = path.basename(xcodeProjectFolderPath);

  if (!pbxprojFile) {
    throw new Error('cordova-ios-entitlements: could not find project.pbxproj file');
  }

  var xcodeProject = xcode.project(pbxprojFile);
  xcodeProject.parseSync();

  var entitlementsDestinationFileName = 'Entitlements.entitlements';
  var entitlementsDestinationFilePath = path.join(xcodeProjectFolderPath, entitlementsDestinationFileName);
  var entitlementsXcodeFilePath = path.join(xcodeProjectFolderName, entitlementsDestinationFileName);
  
  fs.writeFileSync(entitlementsDestinationFilePath, entitlementsContent);

  xcodeHelpers.addEntitlementsFileToProject(xcodeProject, entitlementsXcodeFilePath);
  xcodeHelpers.useCodeSignEntitlementsForConfiguration(xcodeProject, entitlementsXcodeFilePath);

  fs.writeFileSync(pbxprojFile, xcodeProject.writeSync());
};