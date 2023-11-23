import * as pulumi from "@pulumi/pulumi";
export const project = pulumi.getProject();
export const stage = pulumi.getStack();
export const organization = pulumi.getOrganization();
export const tags = {
  "vfd:stack": stage,
  "vfd:project": project,
};

export function getResourceName(resourceName: string) {
  return `${project}-${resourceName}-${stage}`;
}
