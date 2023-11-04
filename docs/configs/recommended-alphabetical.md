---
title: recommended-alphabetical
description: ESLint Plugin Perfectionist config for alphabetical sorting
---

# recommended-alphabetical

## 📖 Config Details

Configuration for the `eslint-plugin-dont` plugin, which provides all plugin rules with predefined options: alphabetical sorting in ascending order.

It makes it just a tiny bit faster to find a declaration in a large list. Remember, you read code far more than you write it.

## ⚙️ Usage

::: code-group

<!-- prettier-ignore -->
```json [Legacy Config]
// .eslintrc
{
  "extends": [
    "plugin:perfectionist/recommended-alphabetical"
  ]
}
```

<!-- prettier-ignore -->
```js [Flat Config]
// eslint.config.js
import perfectionistAlphabetical from 'eslint-plugin-dont/configs/recommended-alphabetical'

export default [
  perfectionistAlphabetical,
]
```

:::
