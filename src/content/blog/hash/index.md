---
author: wnhlee
pubDatetime: 2024-08-06T23:31:12.000+09:00
modDatetime:
title: 해시함수를 알아보자
pinned: false
tags:
  - hash
  - blockchain
description: 해시함수의 개념과 실생활에서 어떻게 사용되는지 알아보자
---

## Table of Contents

## Intro

해시함수를 알아보자

## 해시함수

### 해시함수 예시

## 암호화 해시

### 쉬운 계산

### 원상 회피

### 두 번째 원상 회피

### 충돌 회피

## SHA

### SHA-1

깃 레퍼런스

### SHA-256

## 비트코인에서

### 해시함수

비트코인 모든 트랜잭션을 단인 해시로 묶어 값을 저장한다

해시함수로 SHA-256을 이중으로 사용한다

SHA-256(SHA-256(tx))

머클트리 해시 값으로 구성된 이진 트리 구조

두 자식 노드의 해시 결과 값을 concat 하여 해시값을 만든다

SHA-256(SHA-256(concat(left, right)))

### PoW

비트코인의 작업 증명

SHA-256(SHA-256(block header))

블록 헤더에는 이전 블록의 해시값, 머클트리 루트 해시값, 난이도, 타임스탬프, 논스값이 들어간다
