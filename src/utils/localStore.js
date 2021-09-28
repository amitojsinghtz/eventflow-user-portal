/**
 *
 * @param {string} key localStorageItem's key
 * @param {boolean} shouldParse should JSON.parse item?
 * @param {function} callBack additional callback on item
 * @returns localStorageItem
 */

export const get = (key, shouldParse, callBack) => {
  try {
    let localItem = localStorage.getItem(key)
    if (shouldParse) localItem = JSON.parse(localItem)
    if (callBack) return callBack(localItem)
    return localItem
  } catch (error) {
    console.log('**intial stage error **', key)
    return undefined
  }
}
