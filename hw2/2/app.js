const {
  readFile,
  access,
  constants,
  appendFile
} = require('node:fs');



function readFilePromise(path, encode) {
  return new Promise((resolve, reject) => {
    readFile(path, encode, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function accessFilePromise(path) {
  return new Promise((resolve, reject) => {
    access(path, constants.F_OK, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function appendFilePromise(path, data) {
  return new Promise((resolve, reject) => {
    appendFile(path, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}



async function main() {

  await accessFilePromise("./user-data.json")
  let data = JSON.parse(await readFilePromise('./user-data.json', 'utf-8'));


  try {
    const read = () => console.table(data);

    const create = (newUser) => {

      if (Array.isArray(newUser) || typeof newUser !== "object" || newUser === null) {
        return "insert suitable data structure"
      }

      if (data.find((user) => user.uid === newUser.uid)) {
        return "this user with this uid has been exist"
      }

      const sample = Object.keys(data[0])

      if (Object.keys(newUser).length !== sample.length) {
        return "invalid format of data"
      }

      for (const key in newUser) {
        if (!newUser[key] || !sample.includes(key)) {
          return "invalid format of data"
        }
      }

      data.push(newUser)
      return `new user with ${newUser.uid} created`

    }

    const deleteUser = (uid) => {

      if (typeof uid !== "number") return "insert suitable format of uid"


      const indexOfTargetUser = data.findIndex(user => user.uid === uid)
      if (indexOfTargetUser === -1) return `user ${uid} not found`

      data = data.toSpliced(indexOfTargetUser, 1)
      return `uid ${uid} deleted`
    }

    const update = (uid, modifiedUser) => {

      if (Array.isArray(modifiedUser) || typeof modifiedUser !== "object" || modifiedUser === null) {
        return "insert suitable data structure"
      }

      if (typeof uid !== "number") return "uid is not in suitable format"

      const targetUser = data.find((user) => user.uid !== uid)
      if (!targetUser) return "target user not found"

      data = data.map((user) => {
        if (user.uid === uid) {
          return {
            ...user,
            ...modifiedUser
          }
        }
        return user
      })

      return "user with ${uid} updated"
    }

    create({
      uid: 22222,
      firstname: 'mahdi',
      lastname: 'mohseni naseb',
      city: 'ahvaz',
      postalCode: '2242689035',
      phoneNumber: '02211783452',
      position: 'ux designer'
    })

    deleteUser(113344)

    update(667788, {
      firstname: "mmmmmmm"
    })

    if (data) {
      const appendData = await appendFilePromise("./data.json", JSON.stringify(data))
    }

    read(data)

  } catch (error) {
    console.log(error);
  }
}

main()