
# Routes

## Route: /Login
## Note: this /login route is the only way to get the accessToken
### Method: Post
#
### Body  { uidFirebase: UserRecord.uid }
The only required param is uidFirebase which is taken from when loging using 
the firebase auth service in the frontend

#
### Response template:

 json : {       status: 200,
                message: "Success",
                data: { userData: userMongoData, accessToken: accessToken }}
#
##  Route: /

#### Method: Get
#
####  Body:
{ topicCodeName, topicName, languageCodeName, languageName } 
#

# Socket IO

## Sample socket + authentication object
const socket = useMemo(() => io(`${process.env.REACT_APP_URL}`, { auth: { token: ${accessToken} } }), []);
###


# API Authentication

### Sample authentication code
    axios.post(`http://localhost:8000/login/`, {
                uidFirebase: data.user.uid
            }).then(function (response) {
                // handle success
                console.log("user data");
                console.log(response);
            })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                    console.log("irac");
                    setValue(data.user.email)

                });



# Constants

    PLANS = {
    PLUS: 'plus',
    PREMIUM: 'premium',
    DEFAULT: 'default'};

    ROLES = {
    EXPERT: 'expert',
    USER: 'user'};

# Event to end call (client side):
    "call:end"

# Expert room events

## Universal events:

### When a user end call (goes offline or leave):
```
 "call:ended"
```
## <u>The join room and user join room logic is the same as the random calling logic.</u>
 ### When the user or the expert __join__ the expertRoom the event  <u>__*"room:join"</u> *__ is sent, just like the random queue
##
### When a __user__ join the room an ready to call, the event  <u>__*"user:joined"*__</u> is sent to the expert just like the random calling feature



##
### Both event <u> __user:join and room:join__  </u>is required to start the conversation, just like the random calling



#
# Expert Side

### Expert start accepting calls (goes online):

###  <u>"expertRoom:join" </u> (just like room:join from random calling)
#
## Get the next call:
```
"expertRoom:nextCall" 
```

if there are no user currently in queue the server will emit an event:
```
 "expertRoom:emptyQueue"
```

 




#
# <u>User Side </u>

## Join an online expert queue:
```
"expertRoom:join"
```
 (just like room:join from random calling)
#

## If the expert is not online, the server will emit an event:
```
"expertRoom:expertOffline"
```

## If the expert is currently calling someone, the server will emit an event:
```
"expertRoom:enqueued"
```


