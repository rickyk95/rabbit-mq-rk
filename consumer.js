const amqp = require('amqplib')

let connection, channel, q;

async function connect() {

	 connection = await amqp.connect('amqp://localhost:5672')

	 channel = await connection.createChannel()

	 q = await channel.assertQueue('rpc_queue')

	 channel.consume('rpc_queue', (msg)=>{


	setTimeout(()=>{


		let x = msg.content.toString() + "2021";

	console.log(msg.content.toString())


	channel.sendToQueue(msg.properties.replyTo,Buffer.from(x.toString()),{

		correlationId:msg.properties.correlationId
	})



	},5000)


})

}

connect()

	



