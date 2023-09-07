const BASE_URL = `https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data`;

export const fetchSampleData = async (): Promise<[any, any]> => {
  const responses = await Promise.all([
    fetch(`${BASE_URL}/california-cities.json`),
    fetch(`${BASE_URL}/arizona-cities.json`)
  ]);

  const data = await Promise.all(responses.map(r => r.json()));
  return [data[0], data[1]];
};
