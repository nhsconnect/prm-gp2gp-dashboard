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
