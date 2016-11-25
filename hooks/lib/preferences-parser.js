var elementTree = require('elementtree');
var fs = require('fs');

exports.parseConfigXml = function(xmlFile) {
    var contents = fs.readFileSync(xmlFile, 'utf-8');
    if(contents) {
        // windows skip the Byte Order Mark.
        contents = contents.substring(contents.indexOf('<'));
    }
    var et = new elementTree.ElementTree(elementTree.XML(contents));
    return et.findall('preference')
            .reduce(
                function(preferences, preference) {
                    preferences[preference.attrib.name] = preference.attrib.value;
                    return preferences;
                }, {}
            );

};