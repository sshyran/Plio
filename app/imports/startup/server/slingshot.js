import { Slingshot } from 'meteor/edgee:slingshot';


const { name, acl, avatarsDir, attachmentsDir }  = Meteor.settings.AWSS3Bucket;

Slingshot.createDirective('usersAvatars', Slingshot.S3Storage, {
  bucket: name,

  acl: acl,

  authorize() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
    }

    return true;
  },

  key(file) {
    return `${avatarsDir}/${file.name}`;
  }
});

Slingshot.createDirective('standardsAttachments', Slingshot.S3Storage, {
  bucket: name,

  acl: acl,

  authorize() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot upload files');
    }

    return true;
  },

  key(file) {
    return `${attachmentsDir}/${file.name}`;
  }
});