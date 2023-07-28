// Implement Redis
/*
  Models
----------
  User, Post, PostTag, Comment, Follow, Like
---------------------------------------------

  User -> Post, Follow, PostTag
  Post -> PostTag, Comment, Like


*/

/*
-------
|Tasks|
-------
  1. create a clear cache function

  2. Apply clear cache to the Post, Follow & PostTag, so that every time when this 
     properties got created, all the cache data which are stored inside memory got
     erased (Only for a perticular User).

  3. Create a create cache function for the User, so that when a user got added, 
     or when someone visit a user, the cache got created

  4. Do same for Post

  5. Fix the Like functionality




*/
