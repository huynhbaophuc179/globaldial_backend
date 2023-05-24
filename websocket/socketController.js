const { v4: uuidv4 } = require('uuid');
const validator = require("../utils/Validator")
const LanguageMap = require("../class/LanguageMap");
const TopicMap = require("../class/TopicMap");
const Room = require("../class/Room")
module.exports = (io, socket) => {


    class NamespaceHandler {
        constructor() {
            this.emailToSocketIdMap = new Map();
            this.socketidToEmailMap = new Map();
            // added a language map for seperating different languages, each language has different topics (rooms) and each room have a separate queue for connection
            this.languageMap = new LanguageMap();
        }
        handleConnection(socket) {
            console.log("a user connected:" + socket.id);
            const handleQueue = (connectionQueue) => {
                console.log("________________________");
                console.log("queue run");

                if (connectionQueue.size() > 1) {
                    const roomObj = connectionQueue.dequeue();
                    const isSocketConnected1 = io.sockets.sockets.has(roomObj.socket1);
                    const isSocketConnected2 = io.sockets.sockets.has(socket.id);

                    if (isSocketConnected1 && isSocketConnected2) {
                        console.log("matched" + this.socketidToEmailMap.get(roomObj.socket1));

                        const roomId = roomObj.room
                        const newData2 = { email: this.socketidToEmailMap.get(socket.id), room: roomId };
                        io.to(roomId).emit("user:joined", { email: newData2.email, id: socket.id });
                        socket.join(roomId);
                        console.log(roomId);
                        io.to(socket.id).emit("room:join", { email: newData2.email, room: roomId });

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
                    connectionQueue.enqueue(roomObj);
                    socket.join(roomObj.room);
                    io.to(socket.id).emit("room:join", { email: this.socketidToEmailMap.get(socket.id), room: roomId });

                }

            }
            const matchRoom = (selectedLanguageMap, topic) => {

                if (selectedLanguageMap.has(topic)) {
                    console.log("topic 1");
                    console.log(topic);
                    handleQueue(selectedLanguageMap.get(topic))
                }
                else {
                    console.log("topic 2");
                    selectedLanguageMap.createTopic(topic)
                    handleQueue(selectedLanguageMap.get(topic))
                }
            }
            // Logic for queuing connections
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
                console.log("_____________________________________");
            }
            // Logic to handle disconnection
            socket.on("disconnect", () => {

                const email = this.socketidToEmailMap.get(socket.id);
                this.emailToSocketIdMap.delete(email);
                this.socketidToEmailMap.delete(socket.id);
                console.log("A user disconnected");
            });
            // entry logic for joining queue
            socket.on("room:join", (data) => {
                console.log("room:join");
                const { email, languague, topic } = data;
                this.emailToSocketIdMap.set(email, socket.id);
                this.socketidToEmailMap.set(socket.id, email);
                matchConnection(email, validator.trim(languague), validator.trim(topic));
                console.log("enqueued");
            });

            socket.on("user:call", ({ to, offer }) => {
                console.log("user:call");
                console.log(to, "+", offer);
                console.log("check", io.sockets.sockets.has(to));
                io.to(to).emit("incomming:call", { from: socket.id, offer });
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
        }
    }


    const defaultNameSpaceHandler = new NamespaceHandler();
    io.on("connection", (socket) => { defaultNameSpaceHandler.handleConnection(socket) });

}

