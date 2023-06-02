
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
        
