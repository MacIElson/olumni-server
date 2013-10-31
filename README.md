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
      "reply": "false",
      "parent": "Carpe",
      "username": "...",
      "date": "...time in ms...",
      "message": "Hello Carpe!",
}
```


&#x20;<a href="#api-GET-posts" name="api-GET-posts">#</a> <b>GET</b> /posts  
Get all posts. Returns: 

```js
{
  "posts": [
    {
      "reply": "false",
      "parent": "Carpe",
      "username": "maci",
      "date": "...time in ms...",
      "message": "Hello Carpe!",
    }
  ]
}
```

&#x20;<a href="#api-GET-parentName-posts" name="api-GET-parentName-posts">#</a> <b>GET</b> /:parentName/posts  
Get posts by by group or top level post. Returns: 

```js
{
  "posts": [
    {
      "reply": "false",
      "parent": "Carpe",
      "username": "maci",
      "date": "...time in ms...",
      "message": "Hello Carpe!",
    }
  ]
}
```

&#x20;<a href="#api-GET-parentName-postsIDs" name="api-GET-parentName-postsIDs">#</a> <b>GET</b> /:parentName/postsIDs 
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
