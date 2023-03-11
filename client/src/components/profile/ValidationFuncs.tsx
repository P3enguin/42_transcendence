export function isBetween(str: string, min: number, max: number): boolean {
  if (str.length >= min && str.length <= max) return true;
  return false;
}

export function isValidName(str: string): boolean {
  const pattern = /^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/g;

  return pattern.test(str);
}
export function isTooLong(str: string): boolean {
  if (str.length > 30) return true;
  return false;
}

export function isEmpty(str: string): boolean {
  if (!str || str.trim() === "") return true;
  return false;
}

export function isClear(str: string): boolean {
  const pattern = /^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/;

  return pattern.test(str);
}

export function isStrong(str: string): boolean {
  const pattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,100}$/g;

  return pattern.test(str);
}
