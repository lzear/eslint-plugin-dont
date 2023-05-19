import sortArrayIncludes, { RULE_NAME as sortArrayIncludesName } from '~/rules/sort-array-includes'
import sortInterfaces, { RULE_NAME as sortInterfacesName } from '~/rules/sort-interfaces'
import sortJsxProps, { RULE_NAME as sortJsxPropsName } from '~/rules/sort-jsx-props'
import sortMapElements, { RULE_NAME as sortMapElementsName } from '~/rules/sort-map-elements'
import sortNamedExports, { RULE_NAME as sortNamedExportsName } from '~/rules/sort-named-exports'
import sortNamedImports, { RULE_NAME as sortNamedImportsName } from '~/rules/sort-named-imports'
import sortUnionTypes, { RULE_NAME as sortUnionTypesName } from '~/rules/sort-union-types'
import { SortType, SortOrder } from '~/typings'
import { name } from '~/package.json'

let getRulesWithOptions = (options: {
  [key: string]: unknown
}): {
  [key: string]: [string, { [key: string]: unknown }]
} => {
  let recommendedRules: {
    [key: string]: [string, { [key: string]: unknown }?]
  } = {
    [sortArrayIncludesName]: ['error', { spreadLast: true }],
    [sortInterfacesName]: ['error'],
    [sortJsxPropsName]: ['error'],
    [sortMapElementsName]: ['error'],
    [sortNamedExportsName]: ['error'],
    [sortNamedImportsName]: ['error'],
    [sortUnionTypesName]: ['error'],
  }
  return Object.fromEntries(
    Object.entries(recommendedRules).map(([key, [message, baseOptions = {}]]) => [
      key,
      [message, Object.assign(baseOptions, options)],
    ]),
  )
}

export default {
  name,
  rules: {
    [sortArrayIncludesName]: sortArrayIncludes,
    [sortInterfacesName]: sortInterfaces,
    [sortJsxPropsName]: sortJsxProps,
    [sortMapElementsName]: sortMapElements,
    [sortNamedExportsName]: sortNamedExports,
    [sortNamedImportsName]: sortNamedImports,
    [sortUnionTypesName]: sortUnionTypes,
  },
  configs: {
    'recommended-natural': getRulesWithOptions({
      type: SortType.natural,
      order: SortOrder.asc,
    }),
    'recommended-line-length': getRulesWithOptions({
      type: SortType['line-length'],
      order: SortOrder.desc,
    }),
  },
}
