import type { TSESTree } from '@typescript-eslint/types'
import type { TSESLint } from '@typescript-eslint/utils'

import type { PartitionComment, SortingNode } from '../typings'

import { isPartitionComment } from '../utils/is-partition-comment'
import { getCommentBefore } from '../utils/get-comment-before'
import { createEslintRule } from '../utils/create-eslint-rule'
import { getGroupNumber } from '../utils/get-group-number'
import { toSingleLine } from '../utils/to-single-line'
import { rangeToDiff } from '../utils/range-to-diff'
import { isPositive } from '../utils/is-positive'
import { SortOrder, SortType } from '../typings'
import { useGroups } from '../utils/use-groups'
import { makeFixes } from '../utils/make-fixes'
import { sortNodes } from '../utils/sort-nodes'
import { complete } from '../utils/complete'
import { pairwise } from '../utils/pairwise'
import { compare } from '../utils/compare'

type MESSAGE_ID = 'unexpectedObjectsOrder'

export enum Position {
  'exception' = 'exception',
  'ignore' = 'ignore',
}

type SortingNodeWithPosition = SortingNode & {
  position: Position
}

type Options = [
  Partial<{
    'custom-groups': { [key: string]: string[] | string }
    'partition-by-comment': PartitionComment
    groups: (string[] | string)[]
    'styled-components': boolean
    'ignore-case': boolean
    order: SortOrder
    type: SortType
  }>,
]

export const RULE_NAME = 'sort-objects'

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce sorted objects',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          'custom-groups': {
            type: 'object',
          },
          'partition-by-comment': {
            type: ['boolean', 'string', 'array'],
            default: false,
          },
          'styled-components': {
            type: 'boolean',
            default: true,
          },
          type: {
            enum: [
              SortType.alphabetical,
              SortType.natural,
              SortType['line-length'],
            ],
            default: SortType.alphabetical,
            type: 'string',
          },
          order: {
            enum: [SortOrder.asc, SortOrder.desc],
            default: SortOrder.asc,
            type: 'string',
          },
          'ignore-case': {
            type: 'boolean',
            default: false,
          },
          groups: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpectedObjectsOrder: 'Expected "{{right}}" to come before "{{left}}"',
    },
  },
  defaultOptions: [
    {
      type: SortType.alphabetical,
      order: SortOrder.asc,
    },
  ],
  create: context => {
    const sortObject = (
      node: TSESTree.ObjectExpression | TSESTree.ObjectPattern,
    ) => {
      if (node.properties.length > 1) {
        const options = complete(context.options.at(0), {
          'partition-by-comment': false,
          type: SortType.alphabetical,
          'styled-components': true,
          'ignore-case': false,
          order: SortOrder.asc,
          'custom-groups': {},
          groups: [],
        })

        const isStyledCallExpression = (identifier: TSESTree.Expression) =>
          identifier.type === 'Identifier' && identifier.name === 'styled'

        const isStyledComponents = (
          styledNode: TSESTree.Node | undefined,
        ): boolean =>
          styledNode !== undefined &&
          styledNode.type === 'CallExpression' &&
          ((styledNode.callee.type === 'MemberExpression' &&
            isStyledCallExpression(styledNode.callee.object)) ||
            (styledNode.callee.type === 'CallExpression' &&
              isStyledCallExpression(styledNode.callee.callee)))

        if (
          !options['styled-components'] &&
          (isStyledComponents(node.parent) ||
            (node.parent.type === 'ArrowFunctionExpression' &&
              isStyledComponents(node.parent.parent)))
        ) {
          return
        }

        const source = context.getSourceCode()

        const formatProperties = (
          props: (
            | TSESTree.ObjectLiteralElement
            | TSESTree.RestElement
            | TSESTree.Property
          )[],
        ): SortingNodeWithPosition[][] =>
          props.reduce(
            (accumulator: SortingNodeWithPosition[][], prop) => {
              if (
                prop.type === 'SpreadElement' ||
                prop.type === 'RestElement'
              ) {
                accumulator.push([])
                return accumulator
              }

              const comment = getCommentBefore(prop, source)

              if (
                options['partition-by-comment'] &&
                comment &&
                isPartitionComment(
                  options['partition-by-comment'],
                  comment.value,
                )
              ) {
                accumulator.push([])
              }

              let name: string
              const position: Position = Position.ignore
              const dependencies: string[] = []

              const { getGroup, setCustomGroups } = useGroups(options.groups)

              if (prop.key.type === 'Identifier') {
                ;({ name } = prop.key)
              } else if (prop.key.type === 'Literal') {
                name = `${prop.key.value}`
              } else {
                name = source.text.slice(...prop.key.range)
              }

              if (prop.value.type === 'AssignmentPattern') {
                const addDependencies = (value: TSESTree.AssignmentPattern) => {
                  if (value.right.type === 'Identifier') {
                    dependencies.push(value.right.name)
                  }

                  const handleComplexExpression = (
                    expression:
                      | TSESTree.ArrowFunctionExpression
                      | TSESTree.ConditionalExpression
                      | TSESTree.LogicalExpression
                      | TSESTree.BinaryExpression
                      | TSESTree.CallExpression,
                  ) => {
                    const nodes = []

                    switch (expression.type) {
                      case 'ArrowFunctionExpression': {
                        nodes.push(expression.body)
                        break
                      }

                      case 'ConditionalExpression': {
                        nodes.push(expression.consequent, expression.alternate)
                        break
                      }

                      case 'LogicalExpression':
                      case 'BinaryExpression': {
                        nodes.push(expression.left, expression.right)
                        break
                      }

                      case 'CallExpression': {
                        nodes.push(...expression.arguments)
                        break
                      }
                    }

                    for (const nestedNode of nodes) {
                      if (nestedNode.type === 'Identifier') {
                        dependencies.push(nestedNode.name)
                      }

                      if (
                        nestedNode.type === 'BinaryExpression' ||
                        nestedNode.type === 'ConditionalExpression'
                      ) {
                        handleComplexExpression(nestedNode)
                      }
                    }
                  }

                  switch (value.right.type) {
                    case 'ArrowFunctionExpression':
                    case 'ConditionalExpression':
                    case 'LogicalExpression':
                    case 'BinaryExpression':
                    case 'CallExpression': {
                      handleComplexExpression(value.right)
                      break
                    }

                    default:
                  }
                }

                addDependencies(prop.value)
              }

              setCustomGroups(options['custom-groups'], name)

              const value = {
                size: rangeToDiff(prop.range),
                group: getGroup(),
                dependencies,
                node: prop,
                position,
                name,
              }

              accumulator.at(-1)!.push(value)

              return accumulator
            },
            [[]],
          )

        for (const nodes of formatProperties(node.properties)) {
          pairwise(nodes, (left, right) => {
            const leftNum = getGroupNumber(options.groups, left)
            const rightNum = getGroupNumber(options.groups, right)

            if (
              leftNum > rightNum ||
              (leftNum === rightNum &&
                isPositive(compare(left, right, options)))
            ) {
              const fix:
                | ((fixer: TSESLint.RuleFixer) => TSESLint.RuleFix[])
                | undefined = fixer => {
                const grouped: {
                  [key: string]: SortingNode[]
                } = {}

                for (const currentNode of nodes) {
                  const groupNum = getGroupNumber(options.groups, currentNode)

                  grouped[groupNum] =
                    groupNum in grouped
                      ? sortNodes([...grouped[groupNum], currentNode], options)
                      : [currentNode]
                }

                const sortedNodes: SortingNode[] = []

                for (const group of Object.keys(grouped).sort()) {
                  sortedNodes.push(...sortNodes(grouped[group], options))
                }

                return makeFixes(fixer, nodes, sortedNodes, source, {
                  partitionComment: options['partition-by-comment'],
                })
              }

              context.report({
                messageId: 'unexpectedObjectsOrder',
                data: {
                  left: toSingleLine(left.name),
                  right: toSingleLine(right.name),
                },
                node: right.node,
                fix,
              })
            }
          })
        }
      }
    }

    return {
      ObjectExpression: sortObject,
      ObjectPattern: sortObject,
    }
  },
})
