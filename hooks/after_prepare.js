var path = require('path');
var fs = require('fs');
var xcodeHelpers = require('./lib/xcode-helpers');

var entitlementsContent =
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.developer.in-app-payments</key>
	<array>
		<string>merchant.com.x.y</string>
	</array>
</dict>
</plist>`;


module.exports = function(ctx) {
  glob = ctx.requireCordovaModule('glob');
  xcode = ctx.requireCordovaModule('xcode');
  var projectRoot = ctx.opts.projectRoot;
  var cordovaIosProjectFolder = path.join(projectRoot, 'platforms', 'ios');
  var pbxprojFile = glob.sync(path.join(cordovaIosProjectFolder, '*.xcodeproj', 'project.pbxproj'))[0];
  var xcodeProjectFolder = path.dirname(pbxprojFile);
  var relativeXcodeProjectFolder = path.basename(xcodeProjectFolder);


  if (!pbxprojFile) {
    throw new Error('cordova-ios-entitlements: could not find project.pbxproj file');
  }

  var xcodeProject = xcode.project(pbxprojFile);
  xcodeProject.parseSync();

  var entitlementsFileName = 'Entitlements.entitlements';
  var entitlementsFilePath = path.join(xcodeProjectFolder, entitlementsFileName);
  var relativeEntitlementsFilePath = path.join(relativeXcodeProjectFolder, entitlementsFileName);
  
  fs.writeFileSync(entitlementsFilePath, entitlementsContent);
  xcodeHelpers.addEntitlementsFileToProject(xcodeProject, relativeEntitlementsFilePath);
  xcodeHelpers.useCodeSignEntitlementsForConfiguration(xcodeProject, relativeEntitlementsFilePath);
  fs.writeFileSync(pbxprojFile, xcodeProject.writeSync());
};