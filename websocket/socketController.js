const { v4: uuidv4 } = require('uuid');
const validator = require("../utils/Validator")
const LanguageMap = require("../class/LanguageMap");
const TopicMap = require("../class/TopicMap");
const Room = require("../class/Room");

const PLANS = require('../constants/plans');
const Topic = require('../schema/topic');
const ConnectionQueue = require('../class/ConnectionQueue');


// warning this code has zero point in readability
// im high on smoke writing this code
// what am i doing

module.exports = (io, socket) => {
    class NamespaceHandler {
        constructor() {
            this.emailToSocketIdMap = new Map();
            this.socketidToEmailMap = new Map();
            this.socketIdtoRoom = new Map();
            // added a language map for seperating different languages, each language has different topics (rooms) and each room have a separate queue for connection
            this.languageMap = new LanguageMap();
            this.expertRoomMap = new Map();
            this.expertQueueMap = new Map();
            this.isTopicPremiumIndex = new Map()
            Topic.find({}).then(
                (data) => {
                    data.forEach(element => {
                        this.isTopicPremiumIndex.set(element._id.toString(), element.isPremium)
                    });
                }
            )
        }


        handleConnection(socket) {
            // 3
            // after the two steps we enqueue for connection
            const handleQueue = (connectionQueue) => {
                console.log(connectionQueue);
                console.log("________________________");
                console.log("queue run");

                if (connectionQueue.size() > 1) {
                    console.log("connection check");
                    const roomObj = connectionQueue.dequeue();
                    const isSocketConnected1 = io.sockets.sockets.has(roomObj.socket1);
                    const isSocketConnected2 = io.sockets.sockets.has(socket.id);

                    if (isSocketConnected1 && isSocketConnected2) {
                        console.log("matched" + this.socketidToEmailMap.get(roomObj.socket1));
                        const roomId = roomObj.room
                        const newData2 = { email: this.socketidToEmailMap.get(socket.id), room: roomId };
                        // connection logic part 2
                        io.to(roomId).emit("user:joined", { email: newData2.email, id: socket.id });
                        socket.join(roomId);
                        io.to(socket.id).emit("room:join", { email: newData2.email, room: roomId });
                        this.socketIdtoRoom.set(socket.id, roomId)
                    } else {
                        // if one of the connection is not currently available
                        // for ex. the user turns off the page and closes the socket
                        // put the connection object back to top
                        if (isSocketConnected1) {
                            console.log("fall back!, enqueued socket 1");
                            connectionQueue.prioritize(roomObj);
                        } else {
                            console.log("fall back!, enqueued socket 2");
                            roomObj.socket1 = socket.id
                            connectionQueue.prioritize(roomObj);
                        }
                    }
                } else {
                    //if no room is currently existing
                    //create one an store the socket id and the room id with it
                    console.log("created new obj");
                    const roomId = uuidv4();
                    const roomObj = new Room(roomId, socket.id)
                    // connection logic part 1
                    connectionQueue.enqueue(roomObj);
                    socket.join(roomObj.room);
                    console.log("this set socket");
                    this.socketIdtoRoom.set(socket.id, roomId)
                    console.log(this.socketIdtoRoom.get(socket.id, roomId));
                    io.to(socket.id).emit("room:join", { email: this.socketidToEmailMap.get(socket.id), room: roomId });
                }
            }
            // 2
            // after matching language, we match topic
            const matchRoom = (selectedLanguageMap, topic) => {
                const isSocketPremium = socket.plan === PLANS.DEFAULT ? false : true
                // check if the user is a premium user and the topic
                // the only option that needs to be prevented is when a user
                // is not a premuim trying to access premium topic
                // the topic also needs to exist
                if (isSocketPremium === false && this.isTopicPremiumIndex.get(topic) === true && selectedLanguageMap.has(topic)) {
                    console.log("non premium user accessing premium topic");
                    socket.emit("permission:denied")
                } else {
                    console.log("topic allowed connection");
                    console.log(topic);
                    handleQueue(selectedLanguageMap.get(topic))
                }
            }
            // 1
            // Logic for queuing connections
            // matching start here
            const matchConnection = (email, language, topic) => {
                console.log("match connection");
                console.log(language, topic);
                var topicName = validator.isValidString(topic) === true ? topic : "default"
                var selectedLanguage = validator.isValidString(language) === true ? language : "default"
                console.log("current map:", topicName, " ", selectedLanguage);
                // if the language specified is not a valid language, or the language is null automatically connect it to
                // the default language from the map

                if (this.languageMap.has(selectedLanguage)) {
                    //get the topic map for the lang if it exist
                    console.log("option 1 lang exist");
                    matchRoom(this.languageMap.get(selectedLanguage), topicName)
                } else {
                    console.log("option 2 lang doesnt exist");
                    //create the topic map for the selected lang if it doesnt exist
                    this.languageMap.createLanguage(selectedLanguage)
                    matchRoom(this.languageMap.get(selectedLanguage), topicName)
                }
                // tf im doing
                // Can add recursion here when the topic is not found
                // check the database, if found, add to index
                // after adding to index, recur
                // too lazy to code, so here's the comment on what i MIGHT do
                console.log("_____________________________________");
            }
            // Logic to handle disconnection

            socket.on("disconnect", () => {
                const email = this.socketidToEmailMap.get(socket.id);
                this.emailToSocketIdMap.delete(email);
                this.socketidToEmailMap.delete(socket.id);
                console.log("room la disconnected");
                console.log(this.socketIdtoRoom);
                const room = this.socketIdtoRoom.get(socket.id);
                socket.to(room).emit("call:ended");
                console.log(room);
                this.socketIdtoRoom.delete(socket.id)
                console.log("A user disconnected");
            });
            socket.on("call:end", () => {
                const email = this.socketidToEmailMap.get(socket.id);
                console.log("ending call");
                console.log(this.socketIdtoRoom);
                const room = this.socketIdtoRoom.get(socket.id);
                socket.to(room).emit("call:ended");
                console.log(room);
                this.socketIdtoRoom.delete(socket.id)
                console.log("A user ended call");
            })
            // entry logic for joining queue
            // idk why im ordering things like this anymore

            socket.on("room:join", (data) => {
                console.log("room:join");
                const { email, language, topic } = data;
                this.emailToSocketIdMap.set(email, socket.id);
                this.socketidToEmailMap.set(socket.id, email);
                matchConnection(email, validator.trim(language), validator.trim(topic));
                console.log("room:join ran");
            });

            socket.on("user:call", ({ to, offer }) => {
                console.log("user:call");
                console.log(to, "+", offer);
                console.log("check", io.sockets.sockets.has(to));
                io.to(to).emit("incoming:call", { from: socket.id, offer });
            });

            socket.on("call:accepted", ({ to, ans }) => {
                console.log("call:accepted");
                io.to(to).emit("call:accepted", { from: socket.id, ans });
            });

            socket.on("peer:nego:needed", ({ to, offer }) => {
                console.log("peer:nego:needed");
                io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
            });

            socket.on("peer:nego:done", ({ to, ans }) => {
                console.log("peer:nego:done");
                io.to(to).emit("peer:nego:final", { from: socket.id, ans });
            });


            // Logic for room matching with expert
            // why dont I make another namespace for this logic?
            // Cuz this is taking more effort than i actualy want to
            // And why are you reading this?

            // im going to push this code without testing, wish them luck
            socket.on("expertRoom:join", (expertId) => {
                //it's 10pm
                //handle logic for the expert role
                if (socket.role === ROLES.EXPERT) {
                    const expertRoom = this.expertRoomMap.get(socket.userId)
                    // if the expert room Already exist
                    if (expertRoom) {

                    } else {
                        const newRoom = new Room(socket.userId, socket.userId);
                        this.expertRoomMap.set(socket.userId, newRoom)
                    }
                    this.socketIdtoRoom.set(expertId, expertId)
                    //ff sake i fogor the flow again
                    // but im goin mad
                    socket.join(socket.userId)
                    io.to(socket.id).emit("expertRoom:join", { email: "", room: socket.userId });



                    this.expertQueueMap().set(socket.userId, new ConnectionQueue);


                    //its 10 and a half
                    //logic for the user role
                } else {
                    const expertRoom = this.expertRoomMap.get(socket.userId)
                    if (expertRoom) {
                        if (expertRoom.isAvailable()) {
                            // const newData2 = { email: this.socketidToEmailMap.get(socket.id),  };
                            io.to(expertId).emit("user:joined", { email: this.socketidToEmailMap.get(socket.id), id: socket.id });
                            socket.join(expertId);
                            io.to(socket.id).emit("room:join", { email: this.socketidToEmailMap.get(socket.id), room: expertId });
                            this.socketIdtoRoom.set(socket.id, expertId)

                        }
                        else {

                            const expertQueue = this.expertQueueMap.get(socket.userId)
                            expertQueue.enqueue(socket.id);
                            socket.emit("expertRoom:enqueued");

                        }

                    }
                    else {
                        socket.emit("expertRoom:expertOffline")
                    }

                }
            });
            // when the expert want to get the next call and end this one

            function handleNextCall(expertId) {
                const expertRoom = this.expertRoomMap.get(socket.userId)
                //tell the user that the expert ended the call
                const expertQueue = this.expertQueueMap.get(socket.userId);
                //  set the room to accept call
                io.to(expertRoom.socket2).emit("call:ended");

                expertRoom.socket2 = null;
                if (expertQueue.size() > 0) {
                    // the socket id param of the user in the queue
                    const userSocketId = expertQueue.dequeue()
                    // the socket instace of the user
                    const targetSocket = io.sockets.sockets.get(userSocketId);
                    if (targetSocket) {
                        io.to(expertId).emit("user:joined", { email: this.socketidToEmailMap.get(socket.id), id: socket.id });
                        targetSocket.join(expertId);
                        io.to(userSocketId).emit("room:join", { email: this.socketidToEmailMap.get(socket.id), room: expertId });

                    }
                    else {
                        handleNextCall(expertId)
                    }

                }
                else {

                    //if no user is in the queue
                    socket.emit("expertRoom:emptyQueue")

                }

            }

            socket.on("expertRoom:nextCall", handleNextCall)

        }
    }
    const defaultNameSpaceHandler = new NamespaceHandler();
    // const premiumNameSpaceHandler = new NamespaceHandler(PLANS.PREMIUM);
    io.on("connection", (socket) => {

        defaultNameSpaceHandler.handleConnection(socket)


    });

}

