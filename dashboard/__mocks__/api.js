import axios from "axios";

export const mockAPIResponse = (status, response) => {
  axios.get = jest.fn().mockResolvedValueOnce({
    status,
    data: response,
  });
};

export const mockAPIResponseRejection = (status, errorResp) => {
  axios.get = jest.fn().mockRejectedValueOnce({
    response: {
      status,
      data: errorResp,
    },
  });
};

