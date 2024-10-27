export type User = {
  _id: String;
  username: String;
  email: String;
  profilePicture: String;
  bio: String;
  gender: String;
  followers: [User];
  following: [User];
  posts: [Post];
  flaggedPosts: [Post];
  flaggedComments: [Comment];
  bookmarks: [Post];
  loginIps: [String];
};

export type Post = {
  disabled: Boolean;
  _id: String;
  caption: String;
  image: String;
  author: User;
  likes: [User];
  comments: [Comment];
  flagged: Boolean;
  flagDetails: FlagDetails;
};
export type Comment = {
  _id: String;
  text: String;
  author: User;
  post: Post;
  flagged: Boolean;
  flagDetails:FlagDetails;
  disabled: Boolean;
};

export type FlagDetails = {
  image: FlagDetail;
  text: FlagDetail;
  video: FlagDetail;
};

export type FlagDetail = {
  probability: String;
  description: String;
};

