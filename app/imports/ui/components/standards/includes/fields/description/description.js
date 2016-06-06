import { Template } from 'meteor/templating';

Template.ESDescription.viewmodel({
  mixin: 'callWithFocusCheck',
  description: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { description } = this.getData();
      this.parent().update({ description });
    });
  },
  getData() {
    const { description } = this.data();
    return { description };
  }
});
