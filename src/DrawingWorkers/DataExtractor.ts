import { SimulationLinkDatum, SimulationNodeDatum } from '../../node_modules/@types/d3/index'
import { JiraGetSearch, JiraIssue } from '../typings/JiraTypes'

import { JiraService } from '../services/jiraService'

export class DataExtractor {
  static statuses: Set<string> = new Set<string>()

  static addStatuses (value: string) {
    if (!this.statuses.has(value)) {
      this.statuses.add(value)
    }
  }

  static populateLabels (data: JiraGetSearch) {
    for (const issue of data.issues) {
      this.addStatuses(issue.fields.status.name)
    }
    return this.statuses
  }

  static getNodes (data: JiraGetSearch): Array<Node> {
    const result: Array<Node> = new Array<Node>()

    data.issues.forEach(issue => {
      result.push({ name: issue.key })
    })

    return result
  }

  static getLinks (data: JiraGetSearch): Array<SimulationLinkDatum<{}>> {
    const nodes = this.getNodes(data)
    const result = new Array<Link>()

    data.issues.forEach(issue => {
      issue.fields.issuelinks.forEach(link => {
        const sourceIndex = this.findIndex(nodes, function (node: { name: string }) {
          return node.name === issue.key
        })

        const targetIndex = this.findIndex(nodes, function (node: { name: string }) {
          return link.inwardIssue ? node.name === link.inwardIssue.key : false
        })

        if (sourceIndex && targetIndex) {
          result.push({ source: sourceIndex, target: targetIndex })
        }
      })
    })

    return result
  }

  static findIndex<T> (array: Array<T>, predicate: Function): number {
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i]) === true) {
        return i
      }
    }
    return -1
  }

  static getNodesAndLinks (data: JiraGetSearch): NodesAndLinks {
    // var nodes = new Array<string>()
    const nodes = data.issues
    const links = new Array<LinkStr>()

    // // Make an array of all the issue's keys
    // for (let i = 0 i < data.issues.length i++) {
    //   nodes.push(data.issues[i].key)
    // }

    // make an array of links
    for (let i = 0; i < data.issues.length; i++) {
      const issue = data.issues[i]
      for (let j = 0; j < issue.fields.issuelinks.length; j++) {
        const issueLink = issue.fields.issuelinks[j]
        if (issueLink.type.name === 'Dependency') {
          if (issueLink.outwardIssue) {
            // let outwardLink:LinkStr = { source: issue.key, target: issueLink.outwardIssue.key }
            const outwardLink: LinkStr = { source: issueLink.outwardIssue.key, target: issue.key }
            links.push(outwardLink)
          }
          if (issueLink.inwardIssue) {
            // let inwardIssue: LinkStr = { source: issueLink.inwardIssue.key, target: issue.key }
            const inwardIssue: LinkStr = { source: issue.key, target: issueLink.inwardIssue.key }
            links.push(inwardIssue)
          }
        }
      }
    }

    // Remove duplicate links. Keep graph clean
    const uniqueLinks = new Set<string>()

    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      const linkStr = `S.${link.source}|T.${link.target}`
      if (uniqueLinks.has(linkStr)) {
        links.splice(i, 1)
        i--
        continue
      }

      uniqueLinks.add(linkStr)
    }

    // Check that all Sources and Targets in links are in the nodes
    for (const link of links) {
      const sourceLink = this.findIndex(nodes, (node: JiraIssue) => {
        return node.key === link.source
      })

      if (sourceLink === null) {
        // get node
        nodes.push(JiraService.makeDummyJiraIssue(link.source))
      }

      const targetLink = this.findIndex(nodes, (node: JiraIssue) => {
        return node.key === link.target
      })

      if (targetLink === null) {
        // get node
        nodes.push(JiraService.makeDummyJiraIssue(link.target))
      }
    }

    return { nodes, links }
  }
}

interface Node extends SimulationNodeDatum {
  name: string;
}

interface Link {
  source: number;
  target: number;
}

interface LinkStr {
  source: string;
  target: string;
}

interface NodesAndLinks {
  // nodes: Array<string>,
  nodes: Array<JiraIssue>;
  links: Array<LinkStr>;
}
