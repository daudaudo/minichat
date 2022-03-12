/**
 * Render ext into icon of file type.
 * @param {String} ext 
 * @param {String} classes 
 * @returns 
 */

function render(ext, classes) {
  var template = ``;
  switch(ext) {
    case 'json':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/json-file.png">`;
      break;
    case 'zip':
    case 'rar':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/zip.png">`;
      break;
    case 'pdf':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/pdf.png">`;
      break;
    case 'ppt':
    case 'pptx':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/ppt.png">`;
      break;
    case 'doc':
    case 'docx':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/doc.png">`;
      break;
    case 'xls':
    case 'xlsx':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/xls.png">`;
      break;
    case 'csv':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/csv.png">`;
      break;
    case 'txt':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/txt.png">`;
      break;
    case 'mp3':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/mp3.png">`;
      break;
    case 'mp4':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/mp4.png">`;
      break;
    case 'avi':
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/avi.png">`;
      break;
    default:
      template = `<img draggable="false" class="${classes}" src="/images/filetypes/file.png">`;
      break;
  }
  return template;
}

module.exports = render;
