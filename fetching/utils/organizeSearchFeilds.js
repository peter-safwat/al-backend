const organizeSearchFeilds = (searchFeilds, value) => {
  let feilds = [...searchFeilds];
  feilds = feilds.map((item) => ({
    [item]: new RegExp(value, "i"),
  }));
  return feilds;
};
module.exports = organizeSearchFeilds;
