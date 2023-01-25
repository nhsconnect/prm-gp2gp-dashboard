import moxios from "moxios";

export const mockAPIResponse = (status, response) => {
  moxios.wait(() => {
    let request = moxios.requests.mostRecent();
    request.respondWith({
      status,
      response,
    });
  });
};

export const mockAPIResponseRejection = (status, errorResp) => {
  moxios.wait(() => {
    let request = moxios.requests.mostRecent();
    request.reject({
      status,
      response: errorResp,
    });
  });
};
