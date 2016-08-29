import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { isOrgMember } from '../../checkers.js';
import { Messages } from '../messages.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import Counter from '../../counter/server.js';

Meteor.publish('messagesByDiscussionIds', function(arrDiscussionIds){
	const userIds = [];
	const messages = Messages.find({ discussionId: {$in: arrDiscussionIds} });

	messages.forEach((c, i, cr) => {
		if(userIds.indexOf(c.userId) < 0) {
			userIds.push(c.userId);
		}
	});

	return [
		messages,
		Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } })
	];
});

Meteor.publish('messagesNotViewedCount', function(counterName, documentId) {
  const userId = this.userId;
	const discussion = Discussions.findOne({ linkedTo: documentId, isPrimary: true });
	const discussionId = discussion && discussion._id;

	if (!discussionId || !userId || !isOrgMember(userId, discussion.organizationId)) {
    return this.ready();
  }
  return new Counter(counterName, Messages.find({
    discussionId,
		viewedBy: { $ne: userId }
		// viewedBy: { $ne: this.userId }
  }));
});

// Unread messages by the logged in user, with info about users that created
// the messages.
Meteor.publish('unreadMessagesWithCreatorsInfo', function() {
  const userId = this.userId;

	if(!userId){
		return this.ready();
	}

	const msgs = Messages.find({ viewedBy: { $nin: [userId] } });
	const userIds = msgs.map((msg) => {
		return msg.createdBy;
	});

	const discussionIds = msgs.map((msg) => {
		return msg.discussionId;
	});
	const discussions = Discussions.find(
		{ _id: { $in: discussionIds } },
		{ fields: { linkedTo: 1, organizationId: 1 } }
	);

	const organizationIds = discussions.map((discussion) => {
		return discussion.organizationId;
	});
	const organizations = Organizations.find(
		{ _id: { $in: organizationIds } }, { fields: { serialNumber: 1 } }
	);

	return [
		discussions,
		msgs,
		organizations,
		Meteor.users.find(
			{ _id: { $in: userIds } },
			{ fields: { profile: 1 } }
		)
	];
});
