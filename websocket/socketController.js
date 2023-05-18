
module.exports = (io, socket) => {
    const emailToSocketIdMap = new Map();
    const socketidToEmailMap = new Map();
    //queue for connection queuing
    //queue stores socketID
    const connectionQueue = [];

    const logfunc = () => {
        console.log("lmao");

    }
    io.on("connection", (socket) => {
        console.log(connectionQueue);
        console.log(`Socket Connected`, socket.id);

        //logic for queuing connections
        const matchConnection = () => {
            if (connectionQueue.length > 1) {
                // socket id of the two first socket of the queue
                cnn1 = connectionQueue.shift()
                cnn2 = connectionQueue.shift()
                if (cnn1 && cnn2) {
                    console.log("matched" + socketidToEmailMap.get(cnn1));
                    console.log("matched" + socketidToEmailMap.get(cnn2));
                } else {
                    console.log("some thing gone wrong");
                }

            }
            else {
                console.log("not enough people");

            }
        }

        // socket.on("room:enqueue", (data) => {
        //     connectionQueue.push(socket.id);
        // })
        socket.on("room:join", (data) => {
            const { email, room } = data;
            emailToSocketIdMap.set(email, socket.id);
            socketidToEmailMap.set(socket.id, email);
            io.to(room).emit("user:joined", { email, id: socket.id });
            socket.join(room);
            io.to(socket.id).emit("room:join", data);
            connectionQueue.push(socket.id);
            matchConnection()
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

