import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SubCardEdit.viewmodel({
  mixin: ['collapse'],
  autorun() {
    this.load(this.document());
  },
  onRendered() {
    if (!this._id) {
      this.toggleCollapse(null, 250);
    }
  },
  document: '',
  isSubcard: true,
  isSaving: false,
  isWaiting: false,
  closeAfterCall: false,
  error: '',
  _lText: '',
  _rText: '',
  content: '',
  handleToggleCollapse() {
    if (this._id) {
      this.toggleCollapse(null, 250);
    } else {
      console.log('Save this subcard first.');
    }
  },
  callInsert(insertFn, args, cb) {
    this.beforeSave();

    // We need this setTimeout to display a Saving... state
    Meteor.setTimeout(() => {
      this.subcard.addClass('hidden');
      insertFn(args, (err, res) => {
        this.afterSave(err, res, cb);

        if (!err) {
          this.destroy();
          const newSubcard = ViewModel.findOne(
            'SubCardEdit', vm => vm._id && vm._id() === res
          );
          if (newSubcard) {
            newSubcard.toggleCollapse(null, 250);
            newSubcard.subcard.closest('.modal').animate({
              scrollTop: newSubcard.subcard.position().top + 70
            }, 500, 'swing');
          }
        }
      });
    }, 500);
  },
  callUpdate(updateFn, args, cb) {
    this.beforeSave();

    updateFn(args, (err, res) => {
      this.afterSave(err, res, cb, 500);
    });
  },
  beforeSave() {
    this.isWaiting(false);
    this.isSaving(true);
    this.clearError();
  },
  afterSave(err, res, cb, timeout) {
    const afterSaveFn = () => {
      if (err) {
        err.isFromSubcard = true;
      }

      this.isSaving(false);

      if (err) {
        this.subcard.removeClass('hidden');
        this.setError(err.reason);

        const currentSubcard = this.subcard;
        currentSubcard.closest('.modal').animate({
          scrollTop: currentSubcard.position().top + 70
        }, 500, 'swing');
      } else if (this.closeAfterCall()) {
        this.toggleCollapse();
      }

      this.closeAfterCall(false);

      if (_.isFunction(cb)) {
        return cb(err, res);
      }
    };

    if (_.isFinite(timeout) && (timeout >= 0)) {
      Meteor.setTimeout(() => {
        afterSaveFn();
      }, timeout);
    } else {
      afterSaveFn();
    }
  },
  close() {
    const _id = this._id && this._id();

    if (_id) {
      if (this.isWaiting.value || this.isSaving.value) {
        this.closeAfterCall(true);
      } else {
        this.toggleCollapse();
      }
    } else {
      this.save && this.save();
    }
  },
  setError(errMsg) {
    const setError = () => {
      this.error(errMsg);
      this.errorSection.collapse('show');
    };

    if (!this.collapse.hasClass('in')) {
      this.collapse.collapse('show');

      this.collapse.on('shown.bs.collapse', () => {
        setError();
      });
    } else {
      setError();
    }
  },
  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  },
  hasError() {
    return !!this.error();
  },
  save() {
    this.callInsert(this.insertFn, this.getData());
  },
  delete() {
    this.removeFn(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  update({ ...args }) {
    const _id = this._id && this._id();
    if (!_id) {
      return;
    }

    if (_.keys(args).every(key => this.data()[key] === args[key])) {
      return;
    }

    this.callUpdate(this.updateFn, {
      _id,
      ...args
    });
  },
  getData() {
    return this.child(this.content()).getData();
  }
});
