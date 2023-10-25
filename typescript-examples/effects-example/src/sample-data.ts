const BASE_URL = `https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data`;

export type SampleDataItem = {
  id: string;
  label: string;
  data: object;
};

export const fetchSampleData = async (): Promise<[SampleDataItem]> => {
  const responses = await Promise.all([fetch(`${BASE_URL}/earthquakes.json`)]);

  const data = await Promise.all(responses.map(r => r.json()));
  return [
    {
      id: 'earthquakes',
      label: 'Earthquakes',
      data: data[0]
    }
  ];
};
