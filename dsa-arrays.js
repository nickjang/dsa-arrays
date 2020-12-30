/* eslint-disable eqeqeq */
const memory = new (require('./memory'))();

class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this.ptr = memory.allocate(this.length);
  }

  push(value) {
    if (this._capacity <= this.length)
      this._resize((this.length + 1) * Array.SIZE_RATIO);

    memory.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size) {
    const oldPtr = this.ptr;
    this.ptr = memory.allocate(size);

    if (this.ptr === null)
      throw new Error('Out of memory');

    memory.copy(this.ptr, oldPtr, this.length);
    memory.free(oldPtr);
    this._capacity = size;
  }

  get(index) {
    if (index < 0 || index >= this.length)
      throw new Error('Index error');

    return memory.get(this.ptr + index);
  }

  pop() {
    if (this.length === 0)
      throw new Error('Index error');

    const value = memory.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }

  insert(index, value) {
    if (index < 0 || index > this.length)
      throw new Error('Index error');

    if (this.length >= this._capacity)
      this._resize((this.length + 1) * Array.SIZE_RATIO);

    memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    memory.set(this.ptr + index, value);
    this.length++;
  }

  remove(index) {
    if (index < 0 || index >= this.length)
      throw new Error('Index error');

    memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1);
    this.length--;
  }
}

function main() {

  Array.SIZE_RATIO = 3;

  // Create an instance of the Array class
  let arr = new Array();

  /**
   * 2. Explore the push() method pt. 1
   * Array { length: 1, _capacity: 3, ptr: 0 }
   */
  arr.push(3); // Add an item to the array

  /**
   * 2. Explore the push() method pt. 2
   * Array { length: 6, _capacity: 12, ptr: 3 } because it ran once creating an array of capacity 3, and
   * resized, allocating another part of memory just after the old array to a new array.
   * The capacity is 12 because it started at 3 when pushing one item. Then, it tripled (3 + 1) = 12 when the
   * capacity was reached.
   * The ptr starts at 3 because it ran once creating an array of capacity 3.
   */
  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);

  /**
   * 3. Exploring the pop() method
   * Array { length: 3, _capacity: 12, ptr: 3 }
   * The length is 3 because we popped three items. The capacity can only change positively.
   */
  arr.pop();
  arr.pop();
  arr.pop();

  console.log(arr);
  return arr;
}
//main();

/**
 * 4. Understanding more about how arrays work
 */
function four() {
  const arr = main();
  console.log('Value at index 0:', arr.get(0));

  for (let i = arr.length; i > 0; i--)
    arr.remove(i - 1);
  arr.push('item');
  console.log('Value at index 0:', arr.get(0), ',', arr);
  /**
   * The first itme is NaN because the value is a string, but memory stores floats.
   * The _resize function multiplies the capacity of the array when the length reaches the capacity.
   * It makes adding a new item have a best case of O(1).
   */
}
//four();

/**
 * 5. URLify a string
 * 
 * ' ' -> '%20'
 * 'text  text ' -> 'text%20%20text%20'
 * '' -> ''
 * 'text' -> 'text'
 */
function urlify(str) {
  let url = '';
  let char;
  for (let i = 0; i < str.length; i++) {
    char = str.charAt(i);
    if (char === ' ') url += '%20';
    else url += char;
  }
  return url;
}
//console.log(urlify('text  text '));

/**
 * 6. Filtering an array
 * 
 * [1, 2, 3, 4] -> []
 * [3, 4, 7, 8] -> [7, 8]
 * [] -> []
 * [7, 8] -> [7, 8]
 */
function removeLessThanFive(arr) {
  const filtered = [];
  for (const item of arr)
    if (item > 4) filtered.push(item);
  return filtered;
}
//console.log(removeLessThanFive([3, 4, 7, 8]));

/**
 * 7. Max sum of continuous sequence in the array
 * [4, 6, -3, 5, -2, 1] -> 12
 * [1, 2, -100, 4] -> 4
 * [0, -1, -2, 100, -3] -> 100
 * [] -> 0
 * [1] -> 1
 */
function maxSum(arr) {
  let maxSum = 0;
  let currSum = 0;

  for (const item of arr) {
    currSum += item;
    if (maxSum < currSum) maxSum = currSum;
    if (currSum < 0) currSum = 0;
  }
  return maxSum;
}
//console.log(maxSum([4, 6, -3, 5, -2, 1]));

/**
 * 8. Merge arrays
 * [1, 3, 6, 8, 11] and [2, 3, 5, 8, 9, 10] -> [1, 2, 3, 3, 5, 6, 8, 8, 9, 10, 11]
 * [] [] -> []
 */
function mergeArrays(arr1, arr2) {
  let ptr1 = 0;
  let ptr2 = 0;
  let merged = [];

  while (ptr1 < arr1.length || ptr2 < arr2.length) {
    if (ptr2 >= arr2.length || arr1[ptr1] <= arr2[ptr2]) {
      merged.push(arr1[ptr1]);
      ptr1++;
    } else if (ptr1 >= arr1.length || arr2[ptr2] < arr1[ptr1]) {
      merged.push(arr2[ptr2]);
      ptr2++;
    }
  }
  return merged;
}
//console.log(mergeArrays([1, 3, 6, 8, 11], [2, 3, 5, 8, 9, 10]));

/**
 * 9. Remove characters
 * 'Battle of the Vowels: Hawaii vs. Grozny', 'aeiou' -> 'Bttl f th Vwls: Hw vs. Grzny'
 * '' -> ''
 * 'aeiou' -> ''
 * 'qw' -> 'qw'
 */
function removeCharacters(str, toRemove) {
  let newStr = '';
  const dictRemove = {};

  for (let i = 0; i < toRemove.length; i++)
    dictRemove[toRemove.charAt(i)] = true;

  let char;
  for (let i = 0; i < str.length; i++) {
    char = str.charAt(i);
    if (dictRemove[char]) newStr += ' ';
    else newStr += char;
  }
  return newStr;
}
//console.log(removeCharacters('Battle of the Vowels: Hawaii vs. Grozny', 'aeiou'));

/**
 * 10. Products
 * [1, 3, 9, 4] -> [108, 36, 12, 27]
 * [] -> []
 * [1] -> [0]
 */
function products(arr) {
  let total = 1;
  let productsArr = [];

  if (arr.length === 1) return [0];

  for (const num of arr) total *= num;
  for (let i = 0; i < arr.length; i++)
    productsArr[i] = total / arr[i];
  return productsArr;
}
//console.log(products([1, 3, 9, 4]));

/**
 * 11. 2D array
 * [[1,0,1,1,0],    [[0,0,0,0,0],
 * [0,1,1,1,0],     [0,0,0,0,0],
 * [1,1,1,1,1], ->  [0,0,1,1,0],
 * [1,0,1,1,1],     [0,0,0,0,0],
 * [1,1,1,1,1]];    [0,0,1,1,0]];
 */
function twoDarray(arr) {
  let newArray = arr.map(row => row.map(item => item));
  let rowChanged = {};
  let colChanged = {};

  if (!arr.length) return [];

  for (let row = 0; row < arr.length; row++) {
    for (let col = 0; col < arr.length; col++) {
      if (arr[row][col] === 0) {
        if (!rowChanged[row]) {
          newArray[row] = newArray[row].map(value => 0);
          rowChanged[row] = true;
        }
        if (!colChanged[col]) {
          for (let i = 0; i < arr.length; i++) 
            newArray[i][col] = 0;
          colChanged[col] = true;
        }
      }
    }
  }
  return newArray;
}
// console.log(twoDarray(
//   [[1, 0, 1, 1, 0],
//     [0, 1, 1, 1, 0],
//     [1, 1, 1, 1, 1],
//     [1, 0, 1, 1, 1],
//     [1, 1, 1, 1, 1]]
// ));

/**
 * 12. String rotation
 * amazon, azonma -> false
 * amazon, azonam -> true
 */
function stringRotation(str, rot) {
  let doubledString = rot + rot;
  let ptr1 = 0;
  let ptr2 = 0;

  if (str.length !== rot.length) return false;

  while (ptr1 < doubledString.length) {
    if (doubledString[ptr1] === str[ptr2]) {
      if (ptr2 === str.length - 1) return true;
      ptr1++;
      ptr2++;
    } else {
      ptr1++;
      ptr2 = 0;
    }
  }
  return false;
}
console.log(stringRotation('amazon', 'azonam'));