module.exports = {
  sendJobAlerts: function (frequency) {
    const self = this;
    self.emit({ type: "get-new-jobs", data: "" });
  },

  sendDailyReports: function () {
    self.emit({ type: "get-reports", data: "" });
  },
};
