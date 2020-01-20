import JSZip from "jszip";
import PDFDocument from "./pdfkit.standalone";
import SVGtoPDF from "svg-to-pdfkit";
import blobStream from "blob-stream";

export function pdfzip(items, options) {
  return new Promise(async (resolve) => {
    const zip = new JSZip();
    let documents = 0
    for (let i = 0; i < items.length; i++) {
      const doc = new PDFDocument({ size: options.size || 'A4' });
      const stream = doc.pipe(blobStream());
      SVGtoPDF(doc, items[i].svg, 0, options.top || 72, {
        preserveAspectRatio: "xMidYMin meet",
        height: options.height || 500
      });
      doc.end();
      stream.on("finish", async function () {
        const blob = stream.toBlob("application/pdf");
        zip.file(`${items[i].name}.pdf`, blob);
        documents += 1;
        if (documents >= items.length) {
          const blob = await zip.generateAsync({ type: "blob" });
          return resolve(blob)
        }
      })
    }
  })
}

export function pdf(items, options) {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ size: options.size || 'A4' });
    const stream = doc.pipe(blobStream());
    stream.on("finish", async function () {
      const blob = stream.toBlob("application/pdf");
      return resolve(blob)
    })
    for (let i = 0; i < items.length; i++) {
      if(i !== 0){
        doc.addPage()
      }
      SVGtoPDF(doc, items[i].svg, 0, options.top || 72, {
        preserveAspectRatio: "xMidYMin meet",
        height: options.height || 500
      });      
    }
    doc.end();
  })
}

export function svgzip(items, options) {
  return new Promise(async (resolve) => {
    const zip = new JSZip();
    for (let i = 0; i < items.length; i++) {
      zip.file(`${items[i].name}.svg`, items[i].svg);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    return resolve(blob)
  })
}

export function pngzip(items, options) {
  return new Promise(async (resolve) => {
    const zip = new JSZip();
    for (let i = 0; i < items.length; i++) {
      const img = await createpng(items[i].svg)
      zip.file(`${items[i].name}.png`, img.split(',')[1], { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    return resolve(blob)
  })
}

function createpng(svgtext) {
  return new Promise((resolve) => {
    const div = document.createElement('div');
    div.innerHTML = svgtext;
    const svg = div.querySelector('svg');
    const width = 2000;//svg.getBoundingClientRect().width;
    const height = 2000;//svg.getBoundingClientRect().height;

    const canvas = document.createElement('canvas');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    canvas.width = width;
    canvas.height = height;
    const data = new XMLSerializer().serializeToString(svg);
    const win = window.URL || window.webkitURL || window;
    const img = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = win.createObjectURL(blob);
    img.onload = function () {
      canvas.getContext('2d').drawImage(img, 0, 0);
      win.revokeObjectURL(url);
      const uri = canvas.toDataURL('image/png');
      return resolve(uri)
    };
    img.src = url;
  })
}

export default {
  pdfzip,
  svgzip,
  pngzip,
  pdf,
}
