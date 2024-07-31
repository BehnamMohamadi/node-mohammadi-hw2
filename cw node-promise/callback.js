const {
  ok
} = require("node:assert")
const {
  readFile,
  appendFile,
  access,
  constants
} = require("node:fs/promises")


access("./firstText.txt", constants.F_OK, err => {
  if (err) return console.log("file is not exist")
  readFile("./firstText.txt", "utf-8", (data, err) => {
    if (err) return console.log(err.message)

    access("./secondText.txt", constants.F_OK, err => {
      if (err) return console.log("file is not exist")

      appendFile("./secondText.txt", data, err => {
        if (err) return console.log(err.message)

      })
    })
  })
})