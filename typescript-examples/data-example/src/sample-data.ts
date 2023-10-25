const BASE_URL = `https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data`;

export type SampleDataItem = {
  id: string;
  label: string;
  data: object;
};

export const fetchSampleData = async (): Promise<[SampleDataItem, SampleDataItem]> => {
  const responses = await Promise.all([
    fetch(`${BASE_URL}/california-cities.json`),
    fetch(`${BASE_URL}/arizona-cities.json`)
  ]);

  const data = await Promise.all(responses.map(r => r.json()));
  return [
    {
      id: 'california-cities',
      label: 'California cities',
      data: data[0]
    },
    {
      id: 'arizona-cities',
      label: 'Arizona cities',
      data: data[1]
    }
  ];
};
