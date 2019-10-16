const streamer = require('os-file-stream-handler');
var et = require('elementtree');

const self = module.exports = {

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
     * Will insert a list of nodes into a certain (relative) location
     *
     * @param xml -> the xml file
     * @param nodesList -> the list of nodes to insert
     * @param parentNode -> (optional) the parent of the newly inserted nodes (for root descendent,
     * leave blank)
     */
    addNodes: function (xml, nodesList, parentNode = null) {

        let insertedNodes = [];
        for (let i = 0; i < nodesList.length; i++) {
            let currNode = nodesList[i]
            let insertedNode = self.addNode(xml,
                self.getNodeTag(currNode),
                self.getNodeAttributes(currNode),
                self.getNodeText(currNode),
                parentNode);

            insertedNodes.push(insertedNode)
        }

        return insertedNodes
    },

    /**
     * Will return a dictionary of the node attributes and values
     */
    getNodeAttributes: function (node) {
        return node.attrib
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
     * Will join the paths of dirs
     */
    joinPath: function (...paths) {
        const path = require('path');
        return path.join(...paths)
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
     * Will remove a node
     */
    removeNode: function (parentNode, nodeToRemove) {
        parentNode.remove(nodeToRemove)
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
};
