/**
 * @param object searchObj
 * @returns querySearchAndFilterParams
 */

export const mapQueryParams = ({ ...searchObj }) => {
  console.log('searchObj mapQueryParams', searchObj)
  const queryParams = {
    searchBy: searchObj.searchBy,
    facetFilters: {},
  }
  delete searchObj.searchBy
  for (const property in searchObj) {
      if(searchObj[property] && searchObj[property].length) queryParams.facetFilters[property] = searchObj[property]?.split(',') || ''
  }
  return queryParams
}
