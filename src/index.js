import fs from "fs"
import { processDir } from "./process-dir.js"
import yargs from 'yargs'

const args = yargs(process.argv).parse()

const core = {getInput: (argName) => args[argName]}

const main = async () => {

  const rootPath = core.getInput("root_path") || ""; // Micro and minimatch do not support paths starting with ./
  const maxDepth = core.getInput("max_depth") || 9
  const customFileColors = JSON.parse(core.getInput("file_colors") ||  "{}")
  const colorEncoding = core.getInput("color_encoding") || "type"
  const excludedPathsString = core.getInput("excluded_paths") || "node_modules,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.git,.vscode,package-lock.json,yarn.lock"
  const excludedPaths = excludedPathsString.split(",").map(str => str.trim())

  // Split on semicolons instead of commas since ',' are allowed in globs, but ';' are not + are not permitted in file/folder names.
  const excludedGlobsString = core.getInput('excluded_globs') || ''
  const excludedGlobs = excludedGlobsString.split(";")

  const data = await processDir(rootPath, excludedPaths, excludedGlobs);

  const outputFile = core.getInput("output_file") || "./repo-tree.jsx"

  let fileStr = `import * as React from "react"
import ReactDOM from "react-dom"
import { Tree } from "./src/Tree.tsx"

let data = ${JSON.stringify(data)}
let customFileColors = ${JSON.stringify(customFileColors)}

ReactDOM.render(
  <Tree data={data} maxDepth='${+maxDepth}' colorEncoding='${colorEncoding}' customFileColors={customFileColors}/>, document.getElementById("root")
)`
  
  await fs.writeFileSync(outputFile, fileStr)

}

main()
