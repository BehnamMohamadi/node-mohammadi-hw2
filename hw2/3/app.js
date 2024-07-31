const app = () => {
  const {
    log
  } = require("node:console");
  const {
    readFile,
    writeFile,
    access,
    constants
  } = require("node:fs");

  readFile("./names.txt", "utf-8", (err, data) => {
    if (!!err) return console.log(err.message);

    let userData = [];
    let namesFileData = [];
    const infoesNamesFile = data.split("\r\n");

    for (const info of infoesNamesFile) {
      const newInfo = info.split("-");
      const tmpObj = {
        uid: newInfo[0],
        name: newInfo[1],
      };
      if (!!tmpObj.uid && !!tmpObj.name) {
        if (!isNaN(tmpObj.uid)) {
          namesFileData.push(tmpObj);
        }
      }
    }

    namesFileData = [...mergeDupplicateName(namesFileData)];

    readFile("./numbers.txt", "utf-8", (err, data) => {
      if (!!err) return console.log(err.message);

      let numbersFileData = [];
      const infoesNumbersFile = data.split("\r\n");

      for (const info of infoesNumbersFile) {
        const newInfo = info.split("-");
        const tmpObj = {
          uid: newInfo[0],
          number: newInfo[1] ? newInfo[1] : " ",
        };
        if (!!tmpObj.uid || !!tmpObj.number) {
          // if (!isNaN(tmpObj.uid) && !isNaN(tmpObj.number)) {
          numbersFileData.push(tmpObj);
          // }
        }
        console.log(numbersFileData);
      }

      numbersFileData = [...mergeDupplicateNumbers(numbersFileData)];

      userData = [...mergeUsersData(namesFileData, numbersFileData)];

      access("./result.txt", constants.F_OK, (err) => {
        if (err) console.log(err.message);
        writeFile("./result.txt", readFunc(userData), (err) => {
          if (err) return console.log(err.message);
          console.log("done");
        });
      });
    });
  });
};

app();

function mergeDupplicateName(dataArray) {
  const mergedData = {};
  const result = [];
  for (const item of dataArray) {
    const {
      uid,
      name
    } = item;

    if (!mergedData[uid]) {
      mergedData[uid] = {
        uid: uid,
        name: name
      };
    }
    mergedData[uid].name = name;
  }

  for (const key in mergedData) {
    result.push({
      uid: mergedData[key].uid,
      name: mergedData[key].name,
    });
  }
  return result;
}

function mergeDupplicateNumbers(dataArray) {
  const mergedData = {};
  const result = [];

  for (const item of dataArray) {
    const {
      uid,
      number
    } = item;

    if (!mergedData[uid]) {
      mergedData[uid] = {
        uid: uid,
        numbers: []
      };
    }
    mergedData[uid].numbers.push(number);
  }

  for (const key in mergedData) {
    result.push({
      uid: mergedData[key].uid,
      number: mergedData[key].numbers.join(" ,"),
    });
  }
  return result;
}

function mergeUsersData(nameData, numberData) {
  const userData = nameData.map((name) => {
    const findUser = numberData.find((user) => name.uid === user.uid);
    return {
      ...name,
      ...findUser
    };
  });
  return userData;
}

function readFunc(userData) {
  let text = "";
  for (const user of userData) {
    if (user.number === " " || typeof user.number === "string") {
      text += `${user.name} hasn't any phone number \n`;
    } else if (user.number.includes(",")) {
      text += `${user.name}'s phone numbers are ${user.number} \n`;
    } else {
      text += `${user.name} phone numbers is ${user.number} \n`;
    }
  }
  return text;
}