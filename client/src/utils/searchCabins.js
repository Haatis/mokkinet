export default function searchCabins(searchWord, cabins) {
  if (!searchWord || searchWord.trim() === "") {
    return cabins;
  }

  const searchWordArray = searchWord
    .trim()
    .split(" ")
    .map((query) => query.toLowerCase());

  const searchResults = cabins.filter((cabin) => {
    const cabinName = cabin.name.toLowerCase();
    const cabinDescription = cabin.description.toLowerCase();
    const cabinLocation = cabin.location.toLowerCase();
    const cabinRegion = cabin.region.toLowerCase();

    return searchWordArray.some((query) => {
      return (
        cabinName.includes(query) ||
        cabinDescription.includes(query) ||
        cabinLocation.includes(query) ||
        cabinRegion.includes(query)
      );
    });
  });
  return searchResults;
}
