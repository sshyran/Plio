import { Template } from 'meteor/templating';
import { check } from 'meteor/check';
import { Files } from '/imports/share/collections/files.js';
import { remove as removeFile } from '/imports/api/files/methods.js';

Template.ESSources.viewmodel({
  share: 'docx',
  mixin: ['urlRegex', 'modal', 'callWithFocusCheck', 'organization'],
  autorun() {
    console.log(this.idSourceRendering());
    if (!this.sourceType()) {
      this.sourceType('attachment');
    }
  },
  id: null,
  sourceType: 'attachment',
  sourceUrl: '',
  sourceFileId: '',
  idSourceRendering: null,
  file() {
    const fileId = this.sourceFileId();

    return Files.findOne({ _id: fileId });
  },
  shouldUpdate() {
    const { type, fileId, url } = this.getData();
    const { sourceType, sourceFileId, sourceUrl } = this.templateInstance.data;

    if (type === 'attachment') {
      return _.every([
        type, fileId,
        (type !== sourceType) || (fileId !== sourceFileId)
      ]);
    } else {
      return _.every([
        type && url,
        (type !== sourceType) || (url !== sourceUrl)
      ]);
    }
  },
  changeType(type) {
    this.sourceType(type);

    const context = this.templateInstance.data;
    if (type === context.sourceType) {
      this.sourceUrl(context.sourceUrl || '');
    } else {
      this.sourceUrl('');
    }

    this.update();
  },
  update(e, cb) {
    let { type, fileId, url } = this.getData();

    if (!this.shouldUpdate()) {
      return;
    }

    let sourceDoc = { type };
    if (type === 'attachment') {
      sourceDoc.fileId = fileId;
    } else {
      if ((url.search(/^https?\:\/\//) === -1) && (type !== 'attachment')) {
        url = `http://${url}`;
      }

      if (url && !this.isValidUrl(url)) {
        ViewModel.findOne('ModalWindow').setError('The source file url link is not valid');

        return;
      } else {
        sourceDoc.url = url;
      }
    }

    const query = {
      [`source${this.id()}`]: sourceDoc
    };

    const updateFn = () => this.parent().update(query, cb);

    if (type === 'attachment') {
      updateFn();
    } else {
      this.callWithFocusCheck(e, updateFn);
    }
  },
  renderDocx(url) {
    check(url, String);

    const file = this.file();
    const isDocx = file && file.extension === 'docx';

    if (isDocx) {
      this.idSourceRendering(this.id());

      Meteor.call('Mammoth.convertDocxToHtml', {
        url,
        fileName: file.name + '.html',
        source: `source${this.id()}`,
        standardId:  this.parent()._id(),
      }, (error, result) => {
        if (error) {
          // HTTP errors
          this.renderDocxError(`Failed to get .docx file: ${error}`);
        } else {
          if (result.error) {
            // Mammoth errors
            this.renderDocxError(`Rendering document: ${result.error}`);
          } else {
            this.idSourceRendering(null);
          }
        }
      });
    }
  },
  renderDocxError(error) {
    this.modal().setError(error);
    Meteor.setTimeout(() => {
      this.modal().clearError();
      this.idSourceRendering(null);
    }, 5000);
  },
  afterInsertFn() {
    return this.afterInsert.bind(this);
  },
  afterInsert(fileId, cb) {
    this.sourceFileId(fileId);
    this.update(null, cb);
  },
  afterUploadCb() {
    return this.afterUpload.bind(this);
  },
  afterUpload(fileId, url) {
    this.renderDocx(url);
    this.update();
  },
  removeAttachmentFn() {
    return this.removeAttachment.bind(this);
  },
  removeAttachment() {
    const file = this.file();
    const isFileUploading = !file.isUploaded() && !file.isFailed();

    let warningMsg = 'This attachment will be removed';
    let buttonText = 'Remove';
    if (isFileUploading) {
      warningMsg = 'The upload process will be canceled';
      buttonText = 'OK';
    }

    swal({
      title: 'Are you sure?',
      text: warningMsg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: buttonText,
      closeOnConfirm: true
    }, () => {
      if (isFileUploading) {
        UploadsStore.terminateUploading(this.sourceFileId());
      }

      const options = {
        $unset: {
          [`source${this.id()}`]: ''
        }
      };

      removeFile.call({ _id: file._id });

      this.parent().update({ options }, (err) =>  {
        if (!err && this.id() === 1) {
          const options = {
            $rename: {
              source2: 'source1'
            }
          };
          this.parent().update({ options });
        }
      });
    });
  },
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      standardId: this.parent().standardId()
    };
  },
  getData() {
    const { sourceType: type, sourceFileId: fileId, sourceUrl: url, sourceExtension: extension } = this.data();
    return { type, fileId, url };
  }
});
