import { SimulationNodeDatum } from "../../node_modules/@types/d3/index";
import { SimulationLinkDatum } from "../../node_modules/@types/d3/index";

export interface JiraGetSearch extends SimulationNodeDatum, SimulationLinkDatum<JiraGetSearch> {
  issues: Array<JiraIssue>
}

export interface JiraIssue extends SimulationNodeDatum{
  key: string,
  fields: JiraIssueFields
}

export interface JiraIssueFields {
  summary: string,
  customfield_10302: string,
  customfield_10700: string,
  status: JiraIssueStatus,
  issuelinks: JiraIssueLink[], 
  labels: Array<string>
}

export interface JiraIssueStatus {
  name: string,
  statusCategory: JiraIssueStatusCategory
}

export interface JiraIssueStatusCategory {
  name: string
}

export interface JiraIssueLink {
  type: JiraIssueLinkType,
  inwardIssue: JiraIssue,
  outwardIssue: JiraIssue
}

export interface JiraIssueLinkType {
  name: string
}