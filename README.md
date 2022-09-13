# Repo Visualizer (standalone)

This visualizer was cut out from a GitHub Action that creates an SVG diagram of your repo. Read more [in the original writeup](https://octo.github.com/projects/repo-visualization).

## Usage

### Build processing script

```
yarn build
```

### Extract data from demo

```
node process-repo.js
```

### Run 

```
bun dev
```

## TODO

* add back interactive capabilities mentioned in the original post
* make it into a proper library - portable and working with any repo
* add back ability to generate static SVG
* modify the original action to use the library

## Inputs (from original action)

Please note these inputs do not work in the standalone version (yet).

### `output_file`

A path (relative to the root of your repo) to where you would like the diagram to live.

For example: images/diagram.svg

Default: diagram.svg

### `excluded_paths`

A list of paths to folders to exclude from the diagram, separated by commas.

For example: dist,node_modules

Default: node_modules,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.vscode,package-lock.json,yarn.lock

### `excluded_globs`

A semicolon-delimited array of file [globs](https://globster.xyz/) to exclude from the diagram, using [micromatch](https://github.com/micromatch/micromatch) syntax. Provided as an array.

For example:

```yaml
excluded_globs: "frontend/*.spec.js;**/*.{png,jpg};**/!(*.module).ts"
# Guide:
# - 'frontend/*.spec.js' # exclude frontend tests
# - '**/*.{png,ico,md}'  # all png, ico, md files in any directory
# - '**/!(*.module).ts'  # all TS files except module files
```

### `root_path`

The directory (and its children) that you want to visualize in the diagram, relative to the repository root.

For example: `src/`

Default: `''` (current directory)

### `max_depth`

The maximum number of nested folders to show files within. A higher number will take longer to render.

Default: 9

### `file_colors`

You can customize the colors for specific file extensions. Key/value pairs will extend the [default colors](https://github.com/githubocto/repo-visualizer/pull/src/language-colors.json).

For example: '{"js": "red","ts": "green"}'
default: '{}'

## Outputs

### `svg`

The contents of the diagram as text. This can be used if you don't want to handle new files.
