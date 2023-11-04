---
title: recommended-natural
description: ESLint Plugin Perfectionist config for natural sorting
---

# recommended-natural

## 📖 Config Details

Configuration for the `eslint-plugin-dont` plugin, which provides all plugin rules with predefined options: natural sorting in ascending order.

What is the difference between natural sorting and alphabetical sorting? Natural sort compares strings containing a mixture of letters and numbers, just as a human would do when sorting. For example: `item-1`, `item-2`, `item-10`.

Read more about [natural sort algorithm](https://en.wikipedia.org/wiki/Natural_sort_order).

This configuration will allow you to navigate through your code faster because all the data that can be safely sorted will be in order.

## ⚙️ Usage

::: code-group

<!-- prettier-ignore -->
```json [Legacy Config]
// .eslintrc
{
  "extends": [
    "plugin:perfectionist/recommended-natural"
  ]
}
```

<!-- prettier-ignore -->
```js [Flat Config]
// eslint.config.js
import perfectionistNatural from 'eslint-plugin-dont/configs/recommended-natural'

export default [
  perfectionistNatural,
]
```

:::
