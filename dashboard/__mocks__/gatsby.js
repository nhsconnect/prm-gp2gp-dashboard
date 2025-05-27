const gatsby = jest.requireActual("gatsby");
const React = require("react");

module.exports = {
  ...gatsby,
  navigate: jest.fn(),
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, onClick, ...rest }) => {
    const onClickWithoutDefault = (ev) => {
      ev.preventDefault();
      if (onClick) onClick(ev);
    };

    return React.createElement("a", {
      href: to,
      onClick: onClickWithoutDefault,
      ...rest,
    });
  }),
};
