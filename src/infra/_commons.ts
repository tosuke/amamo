// TODO: to~~ みたいなシグネチャの関数にする or 外部ライブラリ(io-ts or transform-tsの利用)

export function assertIsObject(x: unknown, name: string = 'value'): asserts x is Record<string | number, unknown> {
  if (typeof x !== 'object' || x == null) {
    throw new Error(`${name} must be a JSON object`);
  }
}

export function assertIsArray(x: unknown, name: string = 'value'): asserts x is Array<unknown> {
  if (!Array.isArray(x)) {
    throw new Error(`${name} must be an array`);
  }
}

export function assertIsNumber(x: unknown, name: string = 'value'): asserts x is number {
  if (typeof x !== 'number') {
    throw new Error(`${name} must be a number`);
  } else if (Number.isNaN(x)) {
    throw new Error(`${name} must not be NaN`);
  }
}

export function assertIsInteger(x: unknown, name: string = 'value'): asserts x is number {
  assertIsNumber(x);
  if (!Number.isSafeInteger(x)) {
    throw new Error(`${name} must be a safe integer`);
  }
}

export function assertIsString(x: unknown, name: string = 'value'): asserts x is string {
  if (typeof x !== 'string') {
    throw new Error(`${name} must be a string`);
  }
}
