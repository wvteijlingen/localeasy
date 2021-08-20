// import { execSync } from "child_process"
// import { Config } from "../config"
// import { UserError } from "../error"

// export async function validate(config: Config) {
//   if (config.platform !== "ios") {
//     return
//   }

//   try {
//     execSync("which plutil")
//   } catch {
//     console.log("The plutil command was not found, skipping validation of generated files.")
//     return
//   }

//   console.log(`⏳ Validating generated files.`)

//   for (const filePath of Object.values(config.locales)) {
//     let invalidFiles: string[] = []
//     try {
//       let path = filePath.replace(/(\s+)/g, '\\$1') //escape space character for paths with spaces in them
//       execSync(`plutil -lint ${path}`, { stdio: "inherit" })
//     } catch (error) {
//       invalidFiles.push(filePath)
//     }

//     if (invalidFiles.length > 0) {
//       throw new UserError(
//         `The following generated files are not valid. This is probably due to illegal characters. See the plutil output above and check the files manually: ${invalidFiles.join(
//           "\n"
//         )}`
//       )
//     }
//   }
// }
