import { Emitter } from "@socket.io/redis-emitter"; 
import connection from "./connection.js";

export const emitter = new Emitter(connection)