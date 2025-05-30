export const onPreRenderHTML = ({ getHeadComponents }) => {
  if (process.env.NODE_ENV !== "production") return;

  getHeadComponents().forEach((el) => {
    if (el.type === "style" && el.props["data-href"]) {
      el.type = "link";
      el.props["href"] = el.props["data-href"];
      el.props["rel"] = "stylesheet";
      el.props["type"] = "text/css";

      delete el.props["data-href"];
      delete el.props["dangerouslySetInnerHTML"];
      delete el.props["children"];
    }
  });
};
