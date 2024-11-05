export const arraysEqualAsSets = (arr1: unknown[], arr2: unknown[]) => {
  const a = new Set(arr1);
  const b = new Set(arr2);

  // let a_minus_b = new Set([...a].filter((x) => !b.has(x)));
  // let b_minus_a = new Set([...b].filter((x) => !a.has(x)));

  return equalSets(a, b);
};

export const equalSets = (xs: Set<unknown>, ys: Set<unknown>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));
