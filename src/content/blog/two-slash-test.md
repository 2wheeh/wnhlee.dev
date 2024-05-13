---
author: wonhee
pubDatetime: 2024-05-13T12:47:33.000+09:00
modDatetime:
title: two slash test
featured: false
draft: false
tags:
  - two slash
  - test
description: test two slash
---

## Table of contents

## twoslash Tests

```ts twoslash
const str = "hello world";

// ---cut---

// ts twoslash
console.log(str);
//            ^?
```

```ts
// ts
const str = "hello world";
console.log(str);
```

### twoslash annotation

```ts twoslash
// @errors: 2304
// @strict: false

function compact(arr) {
  if (orr.length > 10) {
    return arr.trim(0, 10);
  }
  return arr;
}
// @annotate: left { "arrowRot": "90deg 8px 27px", "textDegree": "3deg", "top": "0rem" } - Discovered a typo, the param is arr, not orr!
```

### twoslash completions

<!-- prettier-ignore-start -->
```ts twoslash
// @noErrors
const arr = [1, 2];

function sum(...arr: number[]) {
  return arr.s
  //          ^|
}
```
<!-- prettier-ignore-end -->

<br />

### twoslash error

```ts twoslash
// @errors: 2588
const a = "123";
a = 132;
```

### twoslash filecut

```ts twoslash
// @filename: a.ts
export const helloWorld: string = "Hi";

// @filename: b.ts
// ---cut---
import { helloWorld } from "./a";
console.log(helloWorld);
```

### twoslash json

```ts twoslash

// @resolveJsonModule
// @filename: app.json
{ "version": "23.2.3" }

// @filename: index.ts
import appSettings from "./app.json"
appSettings.version
//           ^?
```

### twoslash log

```ts twoslash
console.log("Hello world");
// @log: Hello world

console.warn("Ola Mundo");
// @warn: Old  Mundo

console.error("Neih hou");
// @error: Neih hou
```

### twoslash twofiles

```ts twoslash
// @filename: node_modules/@types/mylib/index.d.ts
export function doit(): string;

// @filename: index.ts
import { doit } from "mylib";
console.log(doit);
```

### twoslash

```ts twoslash {1-3}
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
//  ^?

let b = createLabel(2.8);
//  ^?

let c = createLabel(Math.random() ? "hello" : 42);
//  ^?
```
