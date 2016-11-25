
exports.addEntitlementsFileToProject = function(xcodeProject, entitlementsFile) {
	xcodeProject.addFile(entitlementsFile, xcodeProject.findPBXGroupKey({name:'CustomTemplate'}));
};

exports.useCodeSignEntitlementsForConfiguration = function(xcodeProject, entitlementsFile) {
	var configurations = xcodeProject.pbxXCBuildConfigurationSection();
	for (var config in configurations) {
		var buildSettings = configurations[config].buildSettings;
		if (buildSettings && buildSettings['PRODUCT_NAME']) {
			buildSettings['CODE_SIGN_ENTITLEMENTS'] = '"' + entitlementsFile + '"';
		}
	}
};