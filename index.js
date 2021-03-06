const express = require('express')
const amqp = require('amqplib')
const port = process.env.PORT || 3000;

const amqpLink = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

const app = express()

let connection, channel, q;

async function connect() {

	 connection = await amqp.connect(amqpLink)

	 channel = await connection.createChannel()

	 q = await channel.assertQueue('')

}
connect()

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

app.listen(port,()=>{

	console.log("Listening on 3000")
})
let correlationId;
app.get('/',(req,res)=>{

		res.sendFile(__dirname + '/index.html')

		let greeting = 'hello';

		channel.sendToQueue('rpc_queue',Buffer.from(greeting),{

			correlationId:generateUuid(),
			replyTo:q.queue
		})

		channel.consume(q.queue, (msg)=>{

				console.log(msg.content.toString())
		})
})