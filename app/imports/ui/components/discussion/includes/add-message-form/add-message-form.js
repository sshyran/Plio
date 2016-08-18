import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { Template } from 'meteor/templating';

import {
	addFilesToMessage, addMessage, getMessages, removeMessageById,
	updateFilesUrls
} from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';

/*
 * @param {String} standardId // the ID of the current standard
*/
Template.Discussion_AddMessage_Form.viewmodel({
	mixin: ['discussions', 'standard'],

	disabled: false,
	files: [],
	messageFile: null,
	messageText: '',
	slingshotDirective: 'discussionsFiles',

	discussionId(){
		return this.getDiscussionIdByStandardId(this.standardId());
	},
	sendTextMessage() {
		if (this.disabled()) return;
		const discussionId = this.discussionId();

		addMessage.call({
			discussionId,
			message: sanitizeHtml(this.messageText()),
			type: 'text'
		}, handleMethodResult(() => {
			this.reset();
		}));
	},
	insertFileFn() {
    return this.insertFile.bind(this);
  },

	/* Insert file info as documents into Messages collection:
	 * @param {Array} fileDocs - file documents to save;
	 * @param {Function} cb - callback function.
	*/
  insertFile(fileDocs, cb) {
		if (this.disabled()) return;

		const discussionId = this.discussionId();
		let fileDoc;
		let fileDocId;


		if(!(fileDocs instanceof Array)){
			fileDoc = {
				_id: fileDocs._id,
				name: fileDocs.name,
				extension: fileDocs.name.split('.').pop().toLowerCase()
			};

			fileDocId = addMessage.call({
				discussionId,
				files: [fileDoc],
				type: 'file'
			}, handleMethodResult(cb));

			return;
		}

		fileDocs.forEach((fileDocArg, i) => {
			// File document to save with a messaghe doc in Messages collection
			fileDoc = {
				_id: fileDocArg._id,
				name: fileDocArg.name,
				extension: fileDocArg.name.split('.').pop().toLowerCase()
			};
			const cbf = function(id){
				// Pass each file's ID into callback, so that right file was inserted in S3
				return function(err, res){
					cb(err, res, fileId = id);
				}
			}(fileDoc._id);

			if(i === 0){
				// Add a new message in Messages collection with 1st file doc
				fileDocId = addMessage.call({
					discussionId,
					files: [fileDoc],
					type: 'file'
				}, handleMethodResult(
					/*Upload the appropriate file to S3*/
					cbf
				));
			}
			else{
				// Other file docs add to just inserted new message above
				const options = {
	        $push: {
	          files: fileDoc
	        }
	      };

				return addFilesToMessage.call({
					_id: fileDocId, options
				}, handleMethodResult(/*Upload the appropriate file to S3*/cbf));
			}
		});
  },
	onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
    if (err && err.error !== 'Aborted') {
			// [TODO] Handle error
      return;
    }

    const options = {
      $set: {
        'files.$.url': url
      }
    };

    updateFilesUrls.call({ _id, options });
  },
	onSubmit(e) {
		e.preventDefault();

		if (!Meteor.userId()) return;

		if (!this.standardId()) {
			swal(
				'Oops... Something went wrong',
				'Discussion messages may be added to the particular standard only',
				'error'
			);
		}

		if (!!this.messageText()) {
			this.sendTextMessage();
		} else {
			//[ToDo][Modal] Ask to not add an empty message or just skip?
		}
	},

	/* Remove the file message document form Messages collection,
	 * but not the file itself.
	 * @param {String} fileId - the file ID in the "files" array;
	*/
	removeFileMessage(fileId){
		const query = { 'files._id': fileId};
		const options = { fields: {_id: 1} };
		const messagesWithFileId = getMessages.call({query, options});

		if(!messagesWithFileId.count()){
			return;
		}

		messagesWithFileId.forEach((c, i, cr) => {
			removeMessageById.call({_id: c._id});
		});
	},
	removeFileMessageCb(){
		return this.removeFileMessage.bind(this);
	},
	uploaderMetaContext() {
		const discussionId = this.discussionId();

		return { discussionId };
	},
});
