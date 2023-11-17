---
title: no
description: Just fails
---

<script setup lang="ts">
import CodeEditor from '../../.vitepress/theme/components/code-editor.vue';
import {ruleName, presetConfigs, initialText, fakeLint} from '../../src/sample-code/no';
</script>

> The point is there ain't no point. — Cormac McCarthy

# Disallow everything (`no`)

💼 This rule is enabled in the 🌐 `all` [config](/configs/).

<!-- end auto-generated rule header -->

## 🔧 Config

```js
{ rules: { 'ninja/no': 2 } }
```

## 🧑‍💻 Demo

<CodeEditor :rule="ruleName" :text="initialText" :presetConfigs="presetConfigs" :fakeLint="fakeLint" />
