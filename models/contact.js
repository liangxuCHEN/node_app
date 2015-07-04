'use strict'

var parse = require('co-body')
//require dependencies
var PDFDocument = require('pdfkit')
//var blobStream  = require ('blob-stream')

var fs = require('fs')
//create a document the same way as above
exports.contact = {
  generatorPDF: function *() {
  // create a document and pipe to a blob
    var doc = new PDFDocument()

    // See below for browser usage
    // pipe the document to a blob
    //var stream = doc.pipe(blobStream());

    doc.pipe(fs.createWriteStream('contactPDF/output-2.pdf'))
    // draw some text
    doc.fontSize(25)
       .text('Here is some vector graphics...', 100, 80)
       
    // some vector graphics
    doc.save()
       .moveTo(100, 100)
       .lineTo(100, 250)
       .lineTo(200, 250)
       .fill("#FF3300")
       
    doc.circle(280, 200, 50)
       .fill("#6600FF")
    // an SVG path
    doc.scale(0.6)
       .translate(470, 130)
       .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
       .fill('red', 'even-odd')
       .restore()
     
    // end and display the document in the iframe to the right
    doc.end()

  /*  stream.on ('finish',  function() {
      //get a blob you can do whatever you like with
      //blob = stream.toBlob('application/pdf')
      
      //or get a blob URL for display in the browser
      url = stream.toBlobURL('application/pdf')
      iframe.src = url
    })
   */
  },

  readAllFile : function *() {
    let files = fs.readdirSync('contactPDF')
    let content = {
      file_names: files,
      title: 'contact List',
    }
    console.log(content)
    this.body  = yield render('contactList', content)
  },

  downFile : function *() {
    this.body = fs.createReadStream('contactPDF/'+ this.params.file_name)
    //this.redirect('/allContacts')
   }, 
}

   
