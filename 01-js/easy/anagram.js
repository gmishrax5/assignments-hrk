/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

// function isAnagram(str1, str2) {

// }

// module.exports = isAnagram;


// solution




function isAnagram(str1, str2) {
  // Step 1: Make both strings lowercase
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  // Step 2: Check if lengths match
  if (str1.length !== str2.length) {
    return false;  // Different lengths mean not anagrams
  }
  
  // Step 3: Sort the characters in each string
  const sorted1 = str1.split('').sort().join('');  // Split to array, sort, join back
  const sorted2 = str2.split('').sort().join('');
  
  // Step 4: Compare sorted versions
  return sorted1 === sorted2;  // True if they match
}

module.exports = isAnagram;
