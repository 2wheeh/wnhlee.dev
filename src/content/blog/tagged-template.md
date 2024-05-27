---
author: wonhee
pubDatetime: 2024-05-28T02:37:05.000+09:00
modDatetime:
title: tagged template 을 알아보자
pinned: false
# draft: true
tags:
  - es6
  - tagged template
  - template literal
description: tagged template 을 알아봅시다
---

## Table of contents

## template literal

> ES6에서 도입된 새로운 문자열 표기법이고, 따옴표 대신 백틱을 사용하고, 문자열 안에 변수를 삽입할 수 있다. 그리고 multi-line string을 지원한다. 즉, \n없이도 여러 줄의 문자열을 표현할 수 있다.

template literal에 대해서 설명하라고 하면 위 내용만 주구장창 설명하곤 하는데, [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)을 보면 절반 이상이 tagged template에 대한 설명이다.

## tagged template

템플릿 리터럴이 함수에 의해 태그된 걸 말한다.
태그 즉 이름표처럼 템플릿 리터럴 앞에 함수가 붙은 걸 말한다.

```ts twoslash
function tagFunction(strings: TemplateStringsArray, ...values: any[]) {
  console.log("strings: ", strings);
  console.log("values: ", values);
}

const expression = "foo";

tagFunction`string text ${expression} string text`;
// strings: [ 'string text ', ' string text' ]
// values: [ 'foo' ]
```

템플릿 리터럴의 값이 태그함수에게 인자로 전달된다.

설명만 보면 이걸 어디다 쓰나 싶은데, 가독성을 고려하여 작성된 문자열을 처리할 때 유용하다.

예를들면, CSS, SQL 쿼리, 테이블 마크다운, i18n 적용을 위한 텍스트등의 문자열을 조작하는 함수를 호출하는 경우다. 전달받은 리터럴을 파싱하는 과정을 tagged template의 지원으로 간소화 한다.

포맷팅 된 리터럴을 그대로 함수의 인자로 전달하는 추상화를 통해, 결과적으로 문자열을 보다 직관적이고 안전하게 조작할 수 있게된다.

## tagged template 예시

실제 사용된 코드들을 보면 느낌이 온다.

### styled-components

[styled-components](https://styled-components.com/) 는 리터럴로 작성된 css를 tagged template으로 처리한다.

```tsx twoslash {5-8}
import styled from "styled-components";

const accentColor = "red";

const H1 = styled.h1`
  color: ${accentColor};
  font-size: 4rem;
`;

function App() {
  return (
    <div>
      <H1>Styled Components</H1>
    </div>
  );
}
```

`styled.h1`의 타입인 `ThemeStyledFunction`의 parameter가 tagged template에서 건내주는 argument를 받도록 구현된 걸 볼 수 있다.

`[first: TemplateStringsArray, ...rest: Interpolation<...>[]]`

<!-- prettier-ignore-start -->
```tsx twoslash {1, 3}
import styled, { ThemedStyledFunction } from "styled-components";
// ---cut---
const H1 = styled.h1`...`;
//                 ^?

type WhoAmI = Parameters<ThemedStyledFunction<"h1", any, {}, never>>;
//        ^?
```
<!-- prettier-ignore-end -->

### postgres

[postgres](https://github.com/porsager/postgres/tree/master) 에서도 마찬가지.
tagged template의 지원으로 sql 쿼리를 편하게 작성할 수 있다.

```ts twoslash {8-14, 19}
import postgres from "postgres";

const sql = postgres({
  /* options */
}); // will use psql environment variables

async function getUsersOver(age: string) {
  const users = await sql`
    select
      name,
      age
    from users
    where age > ${age}
  `;
  // users = Result [{ name: "Walter", age: 80 }, { name: 'Murray', age: 68 }, ...]
  return users;
}

type WhoAmI = Parameters<typeof sql>;
//        ^?
```

### jest

[jest](https://jestjs.io/) 에서는 [Table-driven test](https://go.dev/wiki/TableDrivenTests)를 위해 tagged template을 사용할 수 있는데,
테스트 케이스를 무려 markdown 문법의 테이블로 작성할 수 있다.

| a    | b    | expected |
| ---- | ---- | -------- |
| ${1} | ${1} | ${2}     |
| ${1} | ${2} | ${3}     |
| ${2} | ${1} | ${3}     |

이 테이블을 그대로 테스트 케이스로 사용할 수 있다.

```ts twoslash {3-9}
import { describe, test, expect } from "@jest/globals";

describe.each`
  a    | b    | expected
  ---- | ---- | --------
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
  ${2} | ${1} | ${3}
`("$a + $b", ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });

  test(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected);
  });

  test(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected);
  });
});
```

이 외에도 [i18n 적용](https://www.angular.kr/api/localize/init/$localize), [sanitize html](https://wesbos.com/sanitize-html-es6-template-strings), [graphql](https://github.com/apollographql/graphql-tag) 등 다양한 곳에서 문자열을 처리할 때 tagged template을 사용할 수 있고 유용하다.

---

코파일럿 가라사대:

![good](@assets/images/good.png)

---
