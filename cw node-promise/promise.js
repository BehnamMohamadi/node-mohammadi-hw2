const {
  read
} = require("node:fs")
const {
  readFile,
  appendFile,
  access,
  constants
} = require("node:fs/promises")


// access("./firstText.txt", constants.F_OK)
//   .then(() => access("./secondText.txt", constants.F_OK))
//   .then(() => readFile("./firstText.txt", "utf-8"))
//   .then((data) => appendFile("./secondText.txt", data))
//   .then(() => console.log("done"))
//   .catch(err => console.log(err.message))




async function appendingTextFile() {
  try {
    await access("./firstText.txt", constants.F_OK)
    const data = await readFile("./firstText.txt", "utf-8")

    await access("./secondText.txt", constants.F_OK)
    const data2 = await appendFile("./secondText.txt", data)
  } catch (err) {
    console.error(err)
  }
}
appendingTextFile()