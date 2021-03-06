Introduction
------------

This module will build, read and manipulate an xml files. Other handy stuff is also available, like 
search for a specific nodes.
 

## Installation
Install via npm:
    
    npm i os-xml-file-handler


## Functions and signatures:
```js
/**
* Will create an xml file to work with.
* Notice: this method WON'T save the xml in the system. To save the xml, call saveXml(xml)
*
* @param rootNodeTag -> the tag name of the root node
*/
createXml: function (rootNodeTag) {
    return self.loadXml(null, '<?xml version="1.0" encoding="utf-8"?>\n<' + rootNodeTag + '/>')
},


/**
 * Will save any changes made in the xml
 *
 * @param xml -> the xml
 * @param filePath -> the output path of the file
 */
saveXml: function (xml, filePath) {
    let xmlStr = xml.write({'xml_declaration': true});
    streamer.writeFileSync(xmlStr, filePath)
},

/**
 * Will load an xml file
 *
 * @param fromPath -> optional path to the xml file
 * @param fromStr -> optional xml string
 */
loadXml: async function (fromPath, fromStr = null) {
    let xmlStr = fromStr;
    if (xmlStr === null) {
        let xmlInLines = await streamer.readFile(fromPath);
        xmlStr = xmlInLines.join("\n");
    }
    return et.parse(xmlStr);
},

/**
 * Will add a node to a certain (relative) location
 *
 * @param xml -> the xml file
 * @param nodeTag -> the tag for the new node ('String', for example)
 * @param attDict -> optional dict of att and values for the new node
 * @param nodeText -> optional text the new node will carry
 * @param parentNode -> (optional) the parent of the new node (for root descendent, leave blank)
 */
addNode: function (xml, nodeTag, attDict = {}, nodeText = null, parentNode = null) {

    if(parentNode === null) {
        parentNode = self.getRoot(xml)
    }

    let element = et.SubElement(parentNode, nodeTag, attDict);

    if(nodeText !== null) {
        self.setNodeText(element, nodeText)
    }

    return element
},

/**
 * Will return a list of nodes specified by an attribute key and and an attribute value.
 *
 * @param xml -> the xml object
 * @param node_tag -> the tag of the nodes to look for
 * @param node_att_name -> the att name of the nodes to look for
 * @param node_att_val -> the att value of the nodes to look for
 */
getNodes: function (xml, node_tag, node_att_name = null, node_att_val = null) {

    let selector = node_tag;

    if (node_att_name !== null) {
        if (node_att_val !== null) {
            selector = node_tag + "[@" + node_att_name + "='" + node_att_val + "']"
        } else {
            selector = node_tag + "[@" + node_att_name + "]"
        }
    }
    return xml.findall(".//" + selector)
},

/**
 * Will return the root element of the xml
 */
getRoot: function(xml) {
    return xml.getroot()
},

/**
 * Will set the text (inner html) in a given node
 */
setNodeText: function (node, text) {
    node.text = text
},

/**
 * Will return the text (inner html) from a given node
 */
getNodeText: function (node) {
    return node.text
},

/**
 * Will set attributes to an element
 *
 * @param node -> the node to which the attributes will be appended
 * @param attDict -> the dictionary of attributes to add
 */
setNodeAtt: function (node, attDict) {
    for (let key in attDict) {
        if (attDict.hasOwnProperty(key)) {
            node.attrib[key] = attDict[key];
        }
    }
    return node
},

/**
 * Will remove node attribute
 */
removeNodeAtt: function (node, attArr) {
    for (let i = 0; i < attArr.length; i++) {
        delete node.attrib[attArr[i]]
    }
},

/**
 * Will return the node's attribute value
 */
getNodeAttributeValue: function (node, att) {
    return node.attrib[att]
},

/**
 * Will return the tag of a given node
 */
getNodeTag: function (node) {
    return node.tag
},
```
And more...


## Links -> see more tools
* [os-tools-npm](https://github.com/osfunapps/os-tools-npm) -> This module contains fundamental functions to implement in an npm project
* [os-file-handler-npm](https://github.com/osfunapps/os-file-handler-npm) -> This module contains fundamental files manipulation functions to implement in an npm project
* [os-file-stream-handler-npm](https://github.com/osfunapps/os-file-stream-handler-npm) -> This module contains read/write and more advanced operations on files
* [os-xml-handler-npm](https://github.com/osfunapps/os-xml-handler-npm) -> This module will build, read and manipulate an xml file. Other handy stuff is also available, like search for specific nodes

[GitHub - osfunappsapps](https://github.com/osfunapps)

## Licence
ISC