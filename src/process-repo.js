import { exec } from '@actions/exec'
import fs from "fs"
import { processDir } from "./process-dir.js"

let core = {getInput: () => null}

let fileStr = `
import * as React from "react"
import ReactDOM from "react-dom"
import { Tree } from "./src/Tree.tsx"

let data = $$$DATA$$$

ReactDOM.render(
    <Tree data={data} />
    document.getElementById("root")
)
`

const main = async () => {

  const username = 'repo-visualizer'
  await exec('git', ['config', 'user.name', username])
  await exec('git', [
    'config',
    'user.email',
    `${username}@users.noreply.github.com`,
  ])

  const rootPath = core.getInput("root_path") || ""; // Micro and minimatch do not support paths starting with ./
  const maxDepth = core.getInput("max_depth") || 9
  const customFileColors = JSON.parse(core.getInput("file_colors") ||  '{}')
  const colorEncoding = core.getInput("color_encoding") || "type"
  const excludedPathsString = core.getInput("excluded_paths") || "node_modules,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.git,.vscode,package-lock.json,yarn.lock"
  const excludedPaths = excludedPathsString.split(",").map(str => str.trim())

  // Split on semicolons instead of commas since ',' are allowed in globs, but ';' are not + are not permitted in file/folder names.
  const excludedGlobsString = core.getInput('excluded_globs') || ''
  const excludedGlobs = excludedGlobsString.split(";")

  const data = await processDir(rootPath, excludedPaths, excludedGlobs);

  const outputFile = core.getInput("output_file") || "./index.jsx"

  await fs.writeFileSync(outputFile, fileStr.replace('$$$DATA$$$', JSON.stringify(data)))

  console.log("All set!")
}

main()

function execWithOutput(command, args) {
  return new Promise((resolve, reject) => {
    try {
      exec(command, args, {
        listeners: {
          stdout: function (res) {
            core.info(res.toString())
            resolve(res.toString())
          },
          stderr: function (res) {
            core.info(res.toString())
            reject(res.toString())
          }
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}
