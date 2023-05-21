const { v4: uuidv4 } = require('uuid');
module.exports = (io, socket) => {
    // class NamespaceHandler {
    //     constructor() {
    //         this.emailToSocketIdMap = new Map();
    //         this.socketidToEmailMap = new Map();
    //         this.connectionQueue = {
    //             set: new Set(),
    //             array: [],

    //             enqueue(item) {
    //                 if (!this.set.has(item)) {
    //                     this.set.add(item);
    //                     this.array.push(item);
    //                 } else {
    //                     // Item is already in the queue
    //                 }
    //             },

    //             dequeue() {
    //                 const item = this.array.shift();
    //                 if (item !== undefined) {
    //                     this.set.delete(item);
    //                     console.log(`Item ${item} removed from the unique queue.`);
    //                     return item;
    //                 } else {
    //                     return undefined;
    //                 }
    //             },

    //             clear() {
    //                 this.set.clear();
    //                 this.array.length = 0;
    //             },

    //             size() {
    //                 return this.array.length;
    //             }
    //         };
    //     }
    //     handleConnection(socket) {


    //         //unique queue for connection queuing
    //         //unique queue stores socketID

    //         console.log(connectionQueue.array);
    //         console.log(`Socket Connected`, socket.id);

    //         // Logic to handle disconnection
    //         socket.on("disconnect", () => {
    //             const email = socketidToEmailMap.get(socket.id);
    //             emailToSocketIdMap.delete(email);
    //             socketidToEmailMap.delete(socket.id);
    //             console.log(socketidToEmailMap);
    //             console.log(emailToSocketIdMap);
    //             console.log(email, " is the email");
    //             console.log("A user disconnected");
    //         });

    //         // Logic for queuing connections
    //         const matchConnection = (email) => {
    //             if (connectionQueue.size() > 1) {
    //                 // Socket IDs of the two first sockets in the queue
    //                 const socket_id_1 = connectionQueue.dequeue();
    //                 const socket_id_2 = connectionQueue.dequeue();
    //                 const isSocketConnected1 = io.sockets.sockets.has(socket_id_1);
    //                 const isSocketConnected2 = io.sockets.sockets.has(socket_id_2);
    //                 console.log(socket_id_1, "+", socket_id_2);
    //                 if (isSocketConnected1 && isSocketConnected2) {
    //                     console.log("matched" + socketidToEmailMap.get(socket_id_1));
    //                     console.log("matched" + socketidToEmailMap.get(socket_id_2));
    //                     const roomId = uuidv4();
    //                     const newData1 = { email: socketidToEmailMap.get(socket_id_1), room: roomId };
    //                     const newData2 = { email: socketidToEmailMap.get(socket_id_2), room: roomId };

    //                     socket.join(roomId);
    //                     io.to(socket_id_2).emit("room:join", newData2);
    //                     io.to(socket_id_1).emit("room:join", newData1);
    //                     io.to(socket_id_1).emit("user:joined", { email: socketidToEmailMap.get(socket_id_2), id: socket_id_2 });
    //                     io.to(socket_id_2).emit("user:joined", { email: socketidToEmailMap.get(socket_id_1), id: socket_id_1 });
    //                 } else {
    //                     if (isSocketConnected1) {
    //                         console.log("fall back!, enqueued socket 1");
    //                         connectionQueue.enqueue(socket_id_1);
    //                     } else {
    //                         console.log("fall back!, enqueued socket 2");
    //                         connectionQueue.enqueue(socket_id_2);
    //                     }
    //                 }
    //             }
    //         }

    //         socket.on("room:join", (data) => {
    //             const { email, room } = data;
    //             emailToSocketIdMap.set(email, socket.id);
    //             socketidToEmailMap.set(socket.id, email);
    //             connectionQueue.enqueue(socket.id);
    //             console.log(connectionQueue.array);
    //             matchConnection(email);
    //         });

    //         socket.on("user:call", ({ to, offer }) => {
    //             io.to(to).emit("incoming:call", { from: socket.id, offer });
    //         });

    //         socket.on("call:accepted", ({ to, ans }) => {
    //             io.to(to).emit("call:accepted", { from: socket.id, ans });
    //         });

    //         socket.on("peer:nego:needed", ({ to, offer }) => {
    //             console.log("peer:nego:needed", offer);
    //             io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    //         });

    //         socket.on("peer:nego:done", ({ to, ans }) => {
    //             console.log("peer:nego:done", ans);
    //             io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    //         });
    //     }
    // }
    // Default namespace

    class NamespaceHandler {
        constructor() {
            this.emailToSocketIdMap = new Map();
            this.socketidToEmailMap = new Map();
            this.connectionQueue = {
                set: new Set(),
                array: [],

                enqueue(item) {
                    if (!this.set.has(item)) {
                        this.set.add(item);
                        this.array.push(item);
                    } else {
                        // Item is already in the queue
                    }
                },

                dequeue() {
                    const item = this.array.shift();
                    if (item !== undefined) {
                        this.set.delete(item);
                        console.log(`Item ${item} removed from the unique queue.`);
                        return item;
                    } else {
                        return undefined;
                    }
                },

                clear() {
                    this.set.clear();
                    this.array.length = 0;
                },

                size() {
                    return this.array.length;
                }
            };
        }

        handleConnection(socket) {
            console.log(this.connectionQueue.array);
            console.log(`Socket Connected`, socket.id);

            // Logic to handle disconnection
            socket.on("disconnect", () => {
                const email = this.socketidToEmailMap.get(socket.id);
                this.emailToSocketIdMap.delete(email);
                this.socketidToEmailMap.delete(socket.id);
                console.log(this.socketidToEmailMap);
                console.log(this.emailToSocketIdMap);
                console.log(email, " is the email");
                console.log("A user disconnected");
            });

            // Logic for queuing connections
            const matchConnection = (email) => {
                if (this.connectionQueue.size() > 1) {
                    const socket_id_1 = this.connectionQueue.dequeue();
                    const socket_id_2 = this.connectionQueue.dequeue();
                    const isSocketConnected1 = io.sockets.sockets.has(socket_id_1);
                    const isSocketConnected2 = io.sockets.sockets.has(socket_id_2);
                    console.log(socket_id_1, "+", socket_id_2);
                    if (isSocketConnected1 && isSocketConnected2) {
                        console.log("matched" + this.socketidToEmailMap.get(socket_id_1));
                        console.log("matched" + this.socketidToEmailMap.get(socket_id_2));
                        const roomId = uuidv4();
                        const newData1 = { email: this.socketidToEmailMap.get(socket_id_1), room: roomId };
                        const newData2 = { email: this.socketidToEmailMap.get(socket_id_2), room: roomId };

                        socket.join(roomId);
                        io.to(socket_id_2).emit("room:join", newData2);
                        io.to(socket_id_1).emit("room:join", newData1);
                        io.to(socket_id_1).emit("user:joined", { email: this.socketidToEmailMap.get(socket_id_2), id: socket_id_2 });
                        io.to(socket_id_2).emit("user:joined", { email: this.socketidToEmailMap.get(socket_id_1), id: socket_id_1 });
                    } else {
                        if (isSocketConnected1) {
                            console.log("fall back!, enqueued socket 1");
                            this.connectionQueue.enqueue(socket_id_1);
                        } else {
                            console.log("fall back!, enqueued socket 2");
                            this.connectionQueue.enqueue(socket_id_2);
                        }
                    }
                }
            }

            socket.on("room:join", (data) => {
                const { email, room } = data;
                this.emailToSocketIdMap.set(email, socket.id);
                this.socketidToEmailMap.set(socket.id, email);
                this.connectionQueue.enqueue(socket.id);
                console.log(this.connectionQueue.array);
                matchConnection(email);
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

