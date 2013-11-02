# olumni-server

## API

### Groups
join, create, delete groups.

&#x20;<a href="#api-POST-username-group" name="api-POST-username-group">#</a> <b>POST</b> /`:username`/group 
Add user to a group. Submit a payload:

```
{
  "group": "...group name..."
}
```

&#x20;<a href="#api-POST-username-delGroup" name="api-POST-username-delGroup">#</a> <b>POST</b> /`:username`/delGroup  
Remove user from group. Submit a payload:

```
{
  "group": "...group name..."
}
```

&#x20;<a href="#api-GET-username-groups" name="api-GET-username-groups">#</a> <b>GET</b> /`:username`/groups  
Get all groups user is  in. Returns:

```js
{
  "groups": [
    "Carpe",
    "HelpMe"
  ]
}
```

&#x20;<a href="#api-GET-groups" name="api-GET-groups">#</a> <b>GET</b> /groups 
Get all groups. Returns:

```js
{
  "groups": [
    "Carpe",
    "HelpMe"
  ]
}
```

### Posts
Create, join, delete posts.

&#x20;<a href="#api-POST-createPost" name="api-POST-createSession">#</a> <b>POST</b> /createPost  
Create post. Submit a payload:

```
{
      "parent": "Carpe",
      "group": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "message": "Hello Carpe!",
      "viewers": "public" or "mingram&clee&apatterson"
      "reply": "false" or "true"
}
```

&#x20;<a href="#api-POST-username-getMissingPosts" name="api-POST-username-getMissingPosts">#</a> <b>POST</b> /createPost  
Submit a payload:

```
{
      "postIDs": "5275271fa4a3dfd40c000001&5275271fa4a3dfd40d000001",
      "groups": "Carpe&Helpme&Randomness",
}
```
Return:

```js
{
  "posts": [
    {
      "parent": "Carpe",
      "parent": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "lastDate": "...time in ms...",
      "message": "Hello Carpe!",
      "viewers": "public" or "mingram&clee&apatterson",
      "reply": "false" or "true",
      "resolved": "false" or "true"
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-GET-posts" name="api-GET-posts">#</a> <b>GET</b> /posts  
Get all posts. Returns: 

```js
{
  "posts": [
    {
      "parent": "Carpe",
      "parent": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "lastDate": "...time in ms...",
      "message": "Hello Carpe!",
      "viewers": "public" or "mingram&clee&apatterson",
      "reply": "false" or "true",
      "resolved": "false" or "true"
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-GET-parentName-posts" name="api-GET-parentName-posts">#</a> <b>GET</b> /:parentName/posts  
Get posts by group or top level post. Returns: 


```js
{
  "posts": [
    {
      "parent": "Carpe",
      "parent": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "lastDate": "...time in ms...",
      "message": "Hello Carpe!",
      "viewers": "public" or "mingram&clee&apatterson",
      "reply": "false" or "true",
      "resolved": "false" or "true"
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-GET-username-getPosts-postIDs" name="api-GET-username-getPosts-postIDs">#</a> <b>GET</b> /:username/getPosts/`:postIDs`  
Get posts ID(s). eg. /maci/getPosts/52745d971e7d50211b000001&52745d971e7d50211c000001 Returns: 


```js
{
  "posts": [
    {
      "parent": "Carpe",
      "parent": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "lastDate": "...time in ms...",
      "message": "Hello Carpe!",
      "viewers": "public" or "mingram&clee&apatterson",
      "reply": "false" or "true",
      "resolved": "false" or "true"
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-POST-postID-addViewer" name="api-POST-postID-addViewer">#</a> <b>POST</b> /`:postID`/addViewer  
Give user viewing permissions. Submit a payload:

```
{
  "username": "...username..."
}
```

&#x20;<a href="#api-POST-postID-resolved" name="api-POST-postID-resolved">#</a> <b>POST</b> /`:postID`/resolved  
Set resolved Status of post. Submit a payload:

```
{
  "resolved": "true" or "false"
}
```


&#x20;<a href="#api-GET-useranem-parentName-postsIDs" name="api-GET-username-parentName-postsIDs">#</a> <b>GET</b> /:username/:parentName/postsIDs 
Get post IDs by group or top level post. Returns:

```js
{
  "postIDs": [
    "52707801d9e2504012000001",
    "52707801d9e2504013000001"
  ]
}
```

&#x20;<a href="#api-DELETE-delAllPosts321" name="api-DELETE-delAllPosts321">#</a> <b>DELETE</b> /delAllPosts321
Delete all Posts. No payload needed.

&#x20;<a href="#api-POST-delPost-id" name="api-POST-delPost-id">#</a> <b>POST</b> /delPost/`:id`
Delete Post. No payload needed.



## License

MIT
