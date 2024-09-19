# pdfgallery

`pdfgallery` is an npm package that converts images in a directory to a PDF. This tool is useful for creating a PDF gallery of images with a single command.

## Installation

You can use `pdfgallery` without installing it globally by using `npx`:

```sh
npx pdfgallery
```

## Usage

To convert images in a directory to a PDF, run the following command:

```sh
npx pdfgallery [directory]
```

- `[directory]`: The path to the directory containing the images. If not specified, the current working directory will be used.

### Example

To convert images in the `./images` directory to a PDF:

```sh
npx pdfgallery ./images
```

This will create a file named `gallery.pdf` in the current directory containing all the images from the `./images` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
