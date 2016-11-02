import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';

import { insert } from '/imports/api/standards/methods.js';
import { addedToNotifyList } from '/imports/api/standards/methods.js';
import { setModalError, inspire } from '/imports/api/helpers.js';
import { insert as insertFile } from '/imports/api/files/methods.js';
import UploadService from '/imports/ui/utils/uploads/UploadService';


Template.CreateStandard.viewmodel({
  share: 'docx',
  mixin: ['standard', 'numberRegex', 'organization', 'router', 'getChildrenData', 'modal'],
  save() {
    const data = this.getChildrenData();

    const { sourceType, sourceFile, sourceUrl, sourceVideoUrl } = data;
    const isSourcePresent = _.every([
      sourceType,
      sourceFile || sourceUrl || sourceVideoUrl
    ]);
    if (!isSourcePresent) {
      setModalError(
        'The new standard cannot be created without a source file. ' +
        'Please add a source file to your standard.'
      );
      return;
    }

    for (let key in data) {
      if (!data[key]) {
        let errorMessage;
        if (key === 'title') {
          errorMessage = `The new standard cannot be created without a title. Please enter a title for your standard`;
          setModalError(errorMessage);
          return;
        } else if (key === 'sectionId') {
          errorMessage = `The new standard cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
          setModalError(errorMessage);
          return;
        } else if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new standard type in Org settings`;
          setModalError(errorMessage);
          return;
        } else {
          const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
          setModalError(errorMessage);
          return;
        }
      }
    }

    this.insert(data);
  },
  insert(args) {
    const { title, sourceType, sourceFile } = args;

    const number = this.parseNumber(title);
    const nestingLevel = (number && number[0].split('.').length) || 1;

    if (nestingLevel > 4) {
      setModalError('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    _(args).extend({ nestingLevel });

    if ((sourceType === 'attachment') && sourceFile) {
      this.modal().callMethod(insertFile, {
        name: sourceFile.name,
        extension: sourceFile.name.split('.').pop().toLowerCase(),
        organizationId: this.organizationId()
      }, (err, fileId) => {
        if (!err && fileId) {
          this._insertStandard({ ...args, fileId });
        }
      });
    } else {
      this._insertStandard(args);
    }

  },
  _insertStandard(args) {
    const {
      title, sectionId, typeId,
      owner, status, nestingLevel,
      sourceType, sourceFile, sourceUrl,
      sourceVideoUrl, fileId
    } = args;

    const source1 = { type: sourceType };
    if (sourceType === 'attachment') {
      _(source1).extend({ fileId });
    } else {
      const url = {
        url: sourceUrl,
        video: sourceVideoUrl
      }[sourceType];
      _(source1).extend({ url });
    }

    const standardArgs = {
      title,
      sectionId,
      typeId,
      owner,
      status,
      nestingLevel,
      source1,
      ...inspire(['organizationId'], this)
    };

    const cb = (_id, open) => {
      if (sourceFile && fileId) {
        this._uploadFile(sourceFile, fileId, _id);
      }

      this.isActiveStandardFilter('deleted')
        ? this.goToStandard(_id, false)
        : this.goToStandard(_id);

      open({
        _id,
        _title: 'Compliance standard',
        template: 'EditStandard'
      });
    };

    invoke(this.card, 'insert', insert, standardArgs, cb);
  },
  _uploadFile(file, fileId, standardId) {
    const uploadService = new UploadService({
      slingshotDirective: 'standardFiles',
      slingshotContext: {
        standardId,
        organizationId: this.organizationId()
      },
      maxFileSize: Meteor.settings.public.otherFilesMaxSize,
      hooks: {
        afterUpload: (fileId, url) => {
          const fileName = file.name;
          const extension = fileName.split('.').pop().toLowerCase();
          if (extension === 'docx') {
            this._launchDocxRendering(url, fileName, standardId);
          }
        }
      }
    });

    uploadService.uploadExisting(fileId, file);
  },
  _launchDocxRendering(fileUrl, fileName, standardId) {
    this.renderingSourceFileId(1);

    Meteor.call('Mammoth.convertDocxToHtml', {
      url: fileUrl,
      fileName: fileName + '.html',
      source: 'source1',
      standardId,
    }, (error, result) => {
      if (error) {
        // HTTP errors
        toastr.error(`Failed to get .docx file: ${error}`);
      } else {
        if (result.error) {
          // Mammoth errors
          toastr.error(`Rendering document: ${result.error}`);
        } else {
          this.renderingSourceFileId(null);
        }
      }
    });
  }
});
