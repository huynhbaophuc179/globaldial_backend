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
                console.log(`Item ${item} added to the unique queue.`);
            } else {
                console.log(`Item ${item} already exists in the unique queue.`);
            }
        },

        dequeue() {
            const item = this.array.shift();
            if (item !== undefined) {
                this.set.delete(item);
                console.log(`Item ${item} removed from the unique queue.`);
                return item;
            } else {
                console.log('The unique queue is empty.');
                return undefined;
            }
        },

        clear() {
            this.set.clear();
            this.array.length = 0;
            console.log('The unique queue has been cleared.');
        },

        size() {
            return this.array.length;
        }
    };

    io.on("connection", (socket) => {
        console.log(connectionQueue.array);
        console.log(`Socket Connected`, socket.id);

        //logic for queuing connections
        const matchConnection = (email) => {

            if (connectionQueue.size() > 1) {
                // socket id of the two first socket of the queue
                cnn1 = connectionQueue.dequeue()
                cnn2 = connectionQueue.dequeue()
                console.log(cnn1, "+", cnn2);
                if (cnn1 && cnn2) {
                    console.log("matched" + socketidToEmailMap.get(cnn1));
                    console.log("matched" + socketidToEmailMap.get(cnn2));
                    const roomId = uuidv4();
                    roomIdToSocketMap.set(roomId, socket.id);
                    const newData1 = { email: socketidToEmailMap.get(cnn1), room: roomId }
                    const newData2 = { email: socketidToEmailMap.get(cnn2), room: roomId }

                    socket.join(roomId);
                    io.to(cnn2).emit("room:join", newData2);
                    io.to(cnn1).emit("room:join", newData1);
                    io.to(cnn1).emit("user:joined", { email: socketidToEmailMap.get(cnn2), id: cnn2 });
                    io.to(cnn2).emit("user:joined", { email: socketidToEmailMap.get(cnn1), id: cnn1 });

                } else {
                    console.log("both");
                    connectionQueue.enqueue(cnn1)
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
            if (room) {
                io.to(room).emit("user:joined", { email: email, id: socket.id });
                socket.join(room)
            } else {
                connectionQueue.enqueue(socket.id);
                console.log(connectionQueue.array);
                matchConnection(email);

            }

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

