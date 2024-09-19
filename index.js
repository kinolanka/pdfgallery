import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import PDFDocument from 'pdfkit';

try {
  const pdfName = 'gallery.pdf';

  // Get the path to the images directory from the command line arguments
  // If no argument is provided, use the current directory
  const imagesPath = process.argv[2] || process.cwd();

  // Get all files in the images directory
  const files = fs.readdirSync(imagesPath);

  // Filter to get only image files
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  });

  // Throw an error if no image files are found
  if (imageFiles.length === 0) {
    throw new Error('Error: No image files found in the directory.');
  }

  // Check for any gif files and throw an error if found
  const gifFiles = files.filter((file) => path.extname(file).toLowerCase() === '.gif');
  if (gifFiles.length > 0) {
    throw new Error('Error: Directory contains gif images which are not supported.');
  }

  // Create a new PDF document in landscape orientation
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

  // Pipe output to a file in the same directory as the images
  doc.pipe(fs.createWriteStream(path.join(imagesPath, pdfName)));

  // For every 8 image files, add them to a new page in the PDF
  for (let i = 0; i < imageFiles.length; i += 8) {
    if (i > 0) doc.addPage();

    for (let j = 0; j < 8 && i + j < imageFiles.length; j++) {
      const x = 50 + (j % 4) * 200;
      const y = 50 + Math.floor(j / 4) * 300;
      doc.image(path.join(imagesPath, imageFiles[i + j]), x, y, { fit: [220, 220] });
    }
  }

  // Finalize the PDF and end the stream
  doc.end();

  // Log a success message
  console.log(chalk.green(`Success: PDF generated at ${path.join(imagesPath, pdfName)}`));
} catch (error) {
  console.error(chalk.red(error.message));
}
