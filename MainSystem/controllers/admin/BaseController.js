const BaseController = {
  View: (req, res, paramsObj = null, viewName = null) => {
    if (req.originalUrl.split('/').filter(Boolean).length == 3) {
      const [area, controller, action] = req.originalUrl.split('/').filter(Boolean);
      let renderArea = area;
      let renderController = controller;
      let renderAction = action;
      if (viewName) {
        renderAction = viewName;
      }
      if (paramsObj) {
        res.render(`${renderArea}/${renderController}/${renderAction}`, paramsObj);
      } else {
        res.render(`${renderArea}/${renderController}/${renderAction}`);
      }
    } else if (req.originalUrl.split('/').filter(Boolean).length == 2) {
      const [controller, action] = req.originalUrl.split('/').filter(Boolean);
      let renderController = controller;
      let renderAction = action;
      if (viewName) {
        renderAction = viewName;
      }
      if (paramsObj) {
        res.render(`${renderController}/${renderAction}`, paramsObj);
      } else {
        res.render(`${renderController}/${renderAction}`);
      }
    }
    
    
  }
};

module.exports = BaseController;
