async function retrieveWorkPermitsData() {
  return {
    permits: [
      {
        permitName: "Seasonal work certificate",
        permitAccepted: true,
        permitType: "A",
        validityStart: "2023-11-07T00:00:00",
        validityEnd: "2024-02-19T00:00:00",
        industries: ["79.1", "79.9"],
        employerName: "Staffpoint Oy",
      },
    ],
  };
}

export { retrieveWorkPermitsData };
