import { array, boolean, object, string } from "valibot";

const WorkPermitSchema = object({
  permitName: string(),
  permitAccepted: boolean(),
  permitType: string(),
  validityStart: string(),
  validityEnd: string(),
  industries: array(string()),
  employerName: string(),
});

export default WorkPermitSchema;
