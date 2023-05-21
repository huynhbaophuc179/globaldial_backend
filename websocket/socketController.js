const { v4: uuidv4 } = require('uuid');
module.exports = (io, socket) => {
    const emailToSocketIdMap = new Map();
    const socketidToEmailMap = new Map();
    const roomIdToSocketMap = new Map();
    const SocketToRoomIdMap = new Map();


    //unique queue for connection queuing
    //unique queue stores socketID
    const connectionQueue = {
        set: new Set(),
        array: [],

        enqueue(item) {
            if (!this.set.has(item)) {
                this.set.add(item);
                this.array.push(item);

            } else {

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

    io.on("connection", (socket) => {
        console.log(connectionQueue.array);
        console.log(`Socket Connected`, socket.id);


        //logic to handle disconection 
        socket.on("disconnect", () => {
            const email = socketidToEmailMap.get(socket.id)
            emailToSocketIdMap.delete(email)
            socketidToEmailMap.delete(socket.id)
            console.log(socketidToEmailMap);
            console.log(emailToSocketIdMap);
            console.log(email, " is the mail");
            console.log("A user disconnected");

        });

        //logic for queuing connections
        const matchConnection = (email) => {

            if (connectionQueue.size() > 1) {
                // socket id of the two first socket of the queue
                socket_id_1 = connectionQueue.dequeue()
                socket_id_2 = connectionQueue.dequeue()
                const isSocketConnected1 = io.sockets.sockets.has(socket_id_1);
                const isSocketConnected2 = io.sockets.sockets.has(socket_id_2);
                console.log(socket_id_1, "+", socket_id_2);
                if (isSocketConnected1 && isSocketConnected2) {
                    console.log("matched" + socketidToEmailMap.get(socket_id_1));
                    console.log("matched" + socketidToEmailMap.get(socket_id_2));
                    const roomId = uuidv4();
                    roomIdToSocketMap.set(roomId, socket.id);
                    const newData1 = { email: socketidToEmailMap.get(socket_id_1), room: roomId }
                    const newData2 = { email: socketidToEmailMap.get(socket_id_2), room: roomId }

                    socket.join(roomId);
                    io.to(socket_id_2).emit("room:join", newData2);
                    io.to(socket_id_1).emit("room:join", newData1);
                    io.to(socket_id_1).emit("user:joined", { email: socketidToEmailMap.get(socket_id_2), id: socket_id_2 });
                    io.to(socket_id_2).emit("user:joined", { email: socketidToEmailMap.get(socket_id_1), id: socket_id_1 });

                } else {

                    if (isSocketConnected1) {
                        console.log("fall back!, enqueued socket 1");
                        connectionQueue.enqueue(socket_id_1)
                    }
                    else {
                        console.log("fall back!, enqueued socket 2");
                        connectionQueue.enqueue(socket_id_2)
                    }

                }

            }
        }

        // socket.on("room:enqueue", (data) => {
        //     connectionQueue.push(socket.id);
        // })
        socket.on("room:join", (data) => {
            //create a unique room name
            const { email, room } = data;
            // map for tracking reasons
            emailToSocketIdMap.set(email, socket.id);
            socketidToEmailMap.set(socket.id, email);
            // used the old logic to create new room and send its data
            // to preserve the old logic in the frontend side
            //push in to the queue first to ensure the conncurency
            connectionQueue.enqueue(socket.id);
            console.log(connectionQueue.array);
            matchConnection(email);
        });

        socket.on("user:call", ({ to, offer }) => {
            io.to(to).emit("incomming:call", { from: socket.id, offer });
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
    });

}

