Template.Organizations_NcReminders.viewmodel((context) => {
  return {
    getData() {
      return {
        minor: this.minor.getData(),
        major: this.major.getData(),
        critical: this.critical.getData()
      };
    }
  };
});
