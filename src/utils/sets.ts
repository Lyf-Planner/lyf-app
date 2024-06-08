export const arraysEqualAsSets = (arr1: any[], arr2: any[]) => {
  const a = new Set(arr1);
  const b = new Set(arr2);

  // let a_minus_b = new Set([...a].filter((x) => !b.has(x)));
  // let b_minus_a = new Set([...b].filter((x) => !a.has(x)));

  // console.log("A minus B", ...a_minus_b); // {1}
  // console.log("B minus A", ...b_minus_a); // {5}

  return equalSets(a, b);
};

export const equalSets = (xs: any, ys: any) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));