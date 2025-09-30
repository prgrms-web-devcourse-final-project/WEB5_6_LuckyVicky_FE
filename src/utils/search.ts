
// "abc" 가 "a b c" 순서대로 들어있는지만 확인

export function fuzzyMatch(query: string, target: string) {
  query = query.toLowerCase();
  target = target.toLowerCase();

  let qi = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) qi++;
  }
  return qi === query.length;
}