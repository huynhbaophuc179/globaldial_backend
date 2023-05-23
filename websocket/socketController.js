const { v4: uuidv4 } = require('uuid');
const validator = require("../utils/Validator")
const LanguageMap = require("../class/LanguageMap");
const RoomMap = require("../class/RoomMap");

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
                connectionQueue.enqueue(socket.id)
                console.log("queue run");
                console.log(connectionQueue);
                console.log("________________________");
                console.log(connectionQueue.size());
                if (connectionQueue.size() > 1) {
                    const socket_id_1 = connectionQueue.dequeue();
                    const socket_id_2 = connectionQueue.dequeue();
                    const isSocketConnected1 = io.sockets.sockets.has(socket_id_1);
                    const isSocketConnected2 = io.sockets.sockets.has(socket_id_2);
                    console.log(socket_id_1, "+", socket_id_2);
                    if (isSocketConnected1 && isSocketConnected2) {
                        console.log("matched" + this.socketidToEmailMap.get(socket_id_1));

                        const roomId = uuidv4();
                        const newData1 = { email: this.socketidToEmailMap.get(socket_id_1), room: roomId };
                        const newData2 = { email: this.socketidToEmailMap.get(socket_id_2), room: roomId };

                        const socket1 = io.sockets.sockets.get(socket_id_1);
                        io.to(roomId).emit("user:joined", { email: this.socketidToEmailMap.get(socket_id_2), id: socket_id_2 });
                        socket1.join(roomId)
                        io.to(socket_id_1).emit("room:join", newData1);
                        io.to(roomId).emit("user:joined", { email: this.socketidToEmailMap.get(socket_id_2), id: socket_id_2 });
                        socket.join(roomId);
                        io.to(socket_id_2).emit("room:join", { email: newData2.email, room: roomId });




                    } else {

                        if (isSocketConnected1) {
                            console.log("fall back!, enqueued socket 1");
                            connectionQueue.enqueue(socket_id_1);
                        } else {
                            console.log("fall back!, enqueued socket 2");
                            connectionQueue.enqueue(socket_id_2);
                        }
                    }
                } else {


                }

            }
            const matchRoom = (selectedLanguageMap, room) => {

                if (selectedLanguageMap.has(room)) {
                    console.log("room 1");
                    console.log(room);
                    handleQueue(selectedLanguageMap.get(room))
                }
                else {
                    console.log("room 2");
                    selectedLanguageMap.createRoom(room)
                    handleQueue(selectedLanguageMap.get(room))
                }
            }
            // Logic for queuing connections
            const matchConnection = (email, language, room) => {
                var roomName = validator.isValidString(room) === true ? room : "default"
                var selectedLanguage = validator.isValidString(language) === true ? language : "default"
                // if the language specified is not a valid language, or the language is null automatically connect it to
                // the default language from the map

                if (this.languageMap.has(selectedLanguage)) {
                    //get the room map for the lang if it exist
                    console.log("option 1 lang exist");
                    matchRoom(this.languageMap.get(selectedLanguage), roomName)
                } else {
                    console.log("option 2 lang doesnt exist");
                    //create the room map for the selected lang if it doesnt exist
                    this.languageMap.createLanguage(selectedLanguage)
                    matchRoom(this.languageMap.get(selectedLanguage), roomName)
                }
                console.log("match ran");
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
                const { email, languague, room } = data;
                this.emailToSocketIdMap.set(email, socket.id);
                this.socketidToEmailMap.set(socket.id, email);
                // connectionQueue.enqueue(socket.id);
                // console.log(connectionQueue.array);

                matchConnection(validator.trim(languague), validator.trim(languague), validator.trim(room));
                console.log("enqueued");
            });

            socket.on("user:call", ({ to, offer }) => {
                io.to(to).emit("incoming:call", { from: socket.id, offer });
            });

            socket.on("call:accepted", ({ to, ans }) => {
                io.to(to).emit("call:accepted", { from: socket.id, ans });
            });

            socket.on("peer:nego:needed", ({ to, offer }) => {
                console.log("peer:nego:needed", offer);
                io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
            });

            socket.on("peer:nego:done", ({ to, ans }) => {
                console.log("peer:nego:done", ans);
                io.to(to).emit("peer:nego:final", { from: socket.id, ans });
            });
        }
    }


    const defaultNameSpaceHandler = new NamespaceHandler();
    io.on("connection", (socket) => { defaultNameSpaceHandler.handleConnection(socket) });

}

