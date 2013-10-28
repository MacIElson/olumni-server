# weachieve

## API

### Courses
Get, join, delete courses.

&#x20;<a href="#api-POST-username-course" name="api-POST-username-course">#</a> <b>POST</b> /`:username`/course  
Enroll a user in a class. Submit a payload:

```
{
  "course": "...course name..."
}
```

&#x20;<a href="#api-POST-username-delCourse" name="api-POST-username-delCourse">#</a> <b>POST</b> /`:username`/delCourse  
Remove user from class. Submit a payload:

```
{
  "course": "...course name..."
}
```

&#x20;<a href="#api-GET-username-courses" name="api-GET-username-courses">#</a> <b>GET</b> /`:username`/courses  
Get all classes user is enrolled in. Returns:

```js
{
  "courses": [
    "MobileProto",
    "Linearity 2"
  ]
}
```

&#x20;<a href="#api-GET-courses" name="api-GET-courses">#</a> <b>GET</b> /courses  
Get all courses. Returns:

```js
{
  "courses": [
    "MobileProto",
    "Linearity 2"
  ]
}
```

### Sessions
Create, join, delete sessions.

&#x20;<a href="#api-GET-sessions" name="api-GET-sessions">#</a> <b>GET</b> /sessions  
Get all sessions. Returns: 

```js
{
  "sessions": [
    {
      "course": "MobileProto",
      "task": "Lab 5",
      "date": "...",
      "startTime": "...",
      "endTime": "...",
      "place": "WH2AL",
      "usersAttending": [
        "maci"
      ],
      "_id": "525cb61fd94d8c0200000001"
    }
  ]
}
```

&#x20;<a href="#api-POST-createSession" name="api-POST-createSession">#</a> <b>POST</b> /createSession  
Create Session. Submit a payload:

```
{
  "course": "...course name...",
  "task": "...task name...",
  "date": "...date...",
  "startTime": "...time...",
  "endTime": "...time...",
  "place": "...course nameplace...",
  "user": "...first user..."
}
```

&#x20;<a href="#api-DELETE-delAllSessions321" name="api-DELETE-delAllSessions321">#</a> <b>DELETE</b> /delAllSessions321
Delete all Sessions. No payload needed.

&#x20;<a href="#api-POST-delSession-id" name="api-POST-delSession-id">#</a> <b>POST</b> /delSession/`:id`
Delete Session. No payload needed.

&#x20;<a href="#api-POST-session-addUser" name="api-POST-session-addUser">#</a> <b>POST</b> /`:sessionid`/addUser 
Add user to session. Submit a payload:

```
{
  "username": "...username...",
}
```

&#x20;<a href="#api-POST-session-removeUser" name="api-POST-session-removeUser">#</a> <b>POST</b> /`:sessionid`/removeUser 
remove User from session. Submit a payload:

```
{
  "username": "...username...",
}
```




## License

MIT
