---
title: lottery
description: Randomly pass or fail
---

<script setup lang="ts">
import CodeEditor from '../../.vitepress/theme/components/code-editor.vue';
import {ruleName, presetConfigs, initialText, fakeLint} from '../../src/sample-code/lottery';
</script>

> "Not only does God play dice, but… he sometimes throws them where they cannot
> be seen." — Stephen Hawking

# Require luck (`lottery`)

💼 This rule is enabled in the following [configs](/configs/): 🌐 `all`, ✅
`recommended`.

<!-- end auto-generated rule header -->

## ⚙️ Options

### probability

<sub>(default: `'0.99'`)</sub>

In `[0, 1]` - The chances for the linting to **succeed**.

## 🔧 Config

```js
{ rules: { 'ninja/lottery': [2, { probability: 0.1 }] } }
```

## 🧑‍💻 Demo

<CodeEditor :rule="ruleName" :text="initialText" :presetConfigs="presetConfigs" :fakeLint="fakeLint" />
