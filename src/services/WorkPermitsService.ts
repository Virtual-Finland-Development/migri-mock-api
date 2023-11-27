async function retrieveWorkPermitsData() {
  return {
    permits: await import("../data/work-permit-mocks.json"),
  };
}

export { retrieveWorkPermitsData };
