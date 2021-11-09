sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/f/FlexibleColumnLayout"
], function(BaseController, FlexibleColumnLayout) {
  "use strict";
  return BaseController.extend("smpTutorial02.webapp.controller.App", {
    /** @public */
    initialize: function() {
      /** @type {sap.f.FlexibleColumnLayout} oFlexibleColumnLayout */
      const oFlexibleColumnLayout = new FlexibleColumnLayout();
      oFlexibleColumnLayout.getCurrentMidColumnPage();
    }
  })
});
