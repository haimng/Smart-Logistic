export const FACEBOOK = 'facebook';
export const GOOGLE = 'google';

// User
export const USER_FIELDS = ['id','role','first_name','last_name','display_name','avatar','birthdate','sex','state','city','address','phone','intro','website','nc','capacity','status','updated'];
export const USER_PHOTO_SIZES = {
  normal: [{w:600, h:600}, {w:300, h:300}],
  cover: [{w:1200, h:800}],
};

// User.role
export const PORTAL = 'portal';
export const DRIVER = 'driver';
export const SURVEYOR = 'surveyor';

// Notice.type
export const NOTICE_FRIEND = 0;
export const NOTICE_FOLLOW = 1;
export const NOTICE_MESSAGE = 2;
export const NOTICE_LIKE = 3;
export const NOTICE_COMMENT = 4;

// Notice.status
export const NOTICE_STATUS_UNREAD = 0;
export const NOTICE_STATUS_READ = 1;
export const NOTICE_STATUS_FRIEND_APPROVED = 2;
export const NOTICE_STATUS_FRIEND_REJECTED = 3;

// Package.status
export const NEW = 'new';
export const SRC_PORTAL = 'src_portal';
export const DELIVERING = 'delivering';
export const DEST_PORTAL = 'dest_portal';
export const DELIVERED = 'delivered';
