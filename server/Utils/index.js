function filterListWithList(list1 = [], list2 = []) {
  console.log(list1)
  console.log(list2)
  return list1.filter(function (item) {
    return this.toString().indexOf(item) < 0
  }, list2)
}

function isNeighbour(list = [], player1, player2) {
  let index1 = list.findIndex((player) => player.toString() == player1.toString());
  let index2 = list.findIndex((player) => player.toString() == player2.toString());
  if (index1 > -1 && index2 > -1) {
    let d = index1 - index2;
    if (d < 0) {
      d *= -1;
    }
    if (d === 1 || d === (list.length - 1)) {
      return true;
    }
  } else {
    return false
  }
  return false;
}

module.exports = {
  filterListWithList,
  isNeighbour
}
