#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import PDFDocument from 'pdfkit';
import { Command } from 'commander';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command();

  program
    .description('Convert images in a directory to a PDF')
    .argument('[directory]', 'Path to the images directory', process.cwd())
    .action((imagesPath: string) => {
      try {
        const pdfName: string = 'gallery.pdf';

        // Get all files in the images directory
        const files: string[] = fs.readdirSync(imagesPath);

        // Filter to get only image files
        const imageFiles: string[] = files.filter((file: string): boolean => {
          const ext: string = path.extname(file).toLowerCase();
          return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
        });

        // Throw an error if no image files are found
        if (imageFiles.length === 0) {
          throw new Error('Error: No image files found in the directory.');
        }

        // Check for any gif files and throw an error if found
        const gifFiles: string[] = files.filter(
          (file: string): boolean => path.extname(file).toLowerCase() === '.gif'
        );
        if (gifFiles.length > 0) {
          throw new Error('Error: Directory contains gif images which are not supported.');
        }

        // Create a new PDF document in landscape orientation
        const doc: PDFKit.PDFDocument = new PDFDocument({ size: 'A4', layout: 'landscape' });

        // Pipe output to a file in the same directory as the images
        doc.pipe(fs.createWriteStream(path.join(imagesPath, pdfName)));

        // For every 8 image files, add them to a new page in the PDF
        for (let i: number = 0; i < imageFiles.length; i += 8) {
          if (i > 0) doc.addPage();

          for (let j: number = 0; j < 8 && i + j < imageFiles.length; j++) {
            const x: number = 50 + (j % 4) * 200;
            const y: number = 50 + Math.floor(j / 4) * 300;
            doc.image(path.join(imagesPath, imageFiles[i + j]), x, y, { fit: [220, 220] });
          }
        }

        // Finalize the PDF and end the stream
        doc.end();

        // Log a success message
        console.log(chalk.green(`Success: PDF generated at ${path.join(imagesPath, pdfName)}`));
      } catch (error) {
        console.error(chalk.red((error as Error).message));
      }
    });

  program.parse(process.argv);
}

main();
