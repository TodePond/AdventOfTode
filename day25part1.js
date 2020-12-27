/*

Notes
=====

an operation that transforms a subject number
	value = 1
	for ((loop_size) times)
		value = value * subject_number
		value = value % 20201227

card always uses the same secret loop size
door always uses a different secret loop size

handshake
	card.public_key = operation(subject_number = 7, loop_size = card.loop_size)
	door.public_key = operation(subject_number = 7, loop_size = door.loop_size)
	both public keys are sent! (your input)
	card.encryption_key = operation(subject_number = door.public_key, loop_size = card.loop_size)
	door.encryption_key = operation(subject_number = card.public_key, loop_size = door.loop_size)

*/

const operation = (subject, loops) => {
	let value = 1
	for (let i = 0; i < loops; i++) {
		value = value * subject
		value = value % 20201227
	}
	return value
}

const getLoopSize = (publicKey) => {
	let value = 1
	for (let i = 0; i < Infinity; i++) {
		value = value * 7
		value = value % 20201227
		if (value === publicKey) return i+1
	}
}

const cardPublicKey = 5764801
const doorPublicKey = 17807724

const cardLoopSize = getLoopSize(cardPublicKey)
print("Card Loop Size:", cardLoopSize)
const doorLoopSize = getLoopSize(doorPublicKey)
print("Door Loop Size:", doorLoopSize)

const cardEncryptionKey = operation(doorPublicKey, cardLoopSize)
print("Card Encryption Key:", cardEncryptionKey)
const doorEncryptionKey = operation(cardPublicKey, doorLoopSize)
print("Door Encryption Key:", doorEncryptionKey)
