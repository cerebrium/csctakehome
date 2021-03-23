interface objectShape {
  name: string
  id: number,
  parent_id: number | null
}

function sortCategoriesForInsert (inputJson: Array<objectShape>) {
  // rules about data
  // 1. category has a name
  // 2. can have at most one parent category
  // 3. and can have zero or more children

  // shape of data
  // Object with:
  // name: string,
  // parent id: uuid/number -> this case looks like number
  // id: number/uuid -> this case looks like number

  // 1. create some data to work with
  // 2. create tree structure
  // 3. place structure in the array format
  let finalArray: Array<objectShape> | undefined = []

  let objectBucket: any = {}

  // handle heads
  inputJson.forEach((ele, eleId) => {
    if (ele.parent_id === null) {
      finalArray?.unshift(ele)
      objectBucket[1] = [ele]
      inputJson.splice(eleId, 1)
    }
  })

  // recursively loop through and handle assigning buckets
  const recursiveObjectCreator  = (currentArray: Array<objectShape>, level: number): any => {
    currentArray.forEach((ele, eleId) => {
      if (objectBucket[level].find((element: objectShape) => element.id === ele.parent_id)) {
        if (objectBucket[level + 1]) {
          objectBucket[level + 1].push(ele)
          currentArray.splice(eleId, 1)
        } else {
          objectBucket[level+1] = [ele]
          currentArray.splice(eleId, 1)
        }
      }
    })
    if (currentArray.length > 0) {
      return recursiveObjectCreator(currentArray, level+1)
    } else {
      // if all data is processed return the bucket obj
      return objectBucket
    }
  }

  // function for returning the data in the format desired
  const flattenTheObject = (inputObject: any): Array<objectShape> => {
    let finalArray: Array<objectShape> = []

    for (let key in inputObject) {
      inputObject[key].forEach((ele: objectShape) => {
        finalArray.push(ele)
      })
    }
    return finalArray
  }

  // return the data as an array with objects in it containing the correctly mapped data structures
  return flattenTheObject(recursiveObjectCreator(inputJson, 1))
}

function testData (): Array<objectShape> {
  let testDataArray: Array<objectShape> = [
    {
      "name": "head",
      "id": 0,
      "parent_id": null
    }
  ]

  const randomStringGenerator = () => {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let randomString = ''
    for (let i = 0; i < 7; i++) {
      randomString += (alphabet[Math.floor(Math.random() * Math.floor(alphabet.length-1))])
    }
    return randomString
  }

  let parentIdArray = [0]
  let childArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const assignId = () => {
    let numToReturn: number = childArray[Math.ceil(Math.random() * Math.floor(childArray.length - 1))]
    parentIdArray.push(numToReturn)
    let arrayToReplace = childArray.filter(ele => ele !== numToReturn)
    childArray = arrayToReplace
    return numToReturn
  }

  const assignParentId = () => {
    let numToReturn: number = parentIdArray[Math.ceil(Math.random() * Math.floor(parentIdArray.length - 1))]
    let arrayToReplace = parentIdArray.filter(ele => ele !== numToReturn)
    parentIdArray = arrayToReplace
    return numToReturn
  }

  for (let i = 0; i < 100; i++) {
    
    if (i % 10 === 0 && i !== 0) {
      let newChildArray: Array<number> = []
      let newParentArray: Array<number> = []
      // newParentArray.push(i+1)
      for (let j = i; j <= i+10;j++) {
        newChildArray.push(j)
      }
      childArray = newChildArray
      // parentIdArray = newParentArray
      testDataArray.unshift({
        "name": randomStringGenerator(),
        "parent_id": assignParentId(),
        "id": assignId(),
      })
    } else {
      testDataArray.unshift({
        "name": randomStringGenerator(),
        "parent_id": assignParentId(),
        "id": assignId(),
      })
    }
  }

  return testDataArray
}

// to test data call sortCategoriesForInsert
// ex:
// sortCategoriesForInsert([
//   {
//     "name": "Men",
//     "id": 20,
//     "parent_id": null
//   },
//   {
//     "name": "Accessories",
//     "id": 1,
//     "parent_id": 20
//   },
//   {
//     "name": "Watches",
//     "id": 57,
//     "parent_id": 1
//   }
// ]) 
