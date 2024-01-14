const crypto = require('crypto')
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
var iv = crypto.randomBytes(16);
function encrypt(text) {

    let cipher = crypto.createCipheriv(
        'aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
    };
}
function decrypt(encryptedData, inputIv) {
    try {
      let iv = Buffer.from(inputIv, 'hex');
      let encryptedText = Buffer.from(encryptedData, 'hex');
      let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      console.error('Decryption error:', error.message);
      throw error; 
    }
  }
  
module.exports = { encrypt, decrypt };