import permits from "../data/work-permit-mocks.json";

async function retrieveWorkPermitsData() {
  return {
    permits: permits,
  };
}

export { retrieveWorkPermitsData };
