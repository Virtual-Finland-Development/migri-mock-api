import { array, object } from "valibot";
import WorkPermitSchema from "./WorkPermitSchema";

const WorkPermitsResponseSchema = object({
  permits: array(WorkPermitSchema),
});

export default WorkPermitsResponseSchema;
