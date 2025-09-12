const fs = require('fs');
const path = require('path');

class CommandSender {
    constructor() {
        this.commandFile = path.join(__dirname, '..', 'commands.txt');
        this.responseFile = path.join(__dirname, '..', 'responses.txt');
    }
    
    sendCommand(command) {
        try {
            // Escribir comando al archivo
            fs.writeFileSync(this.commandFile, command);
            console.log(`Comando enviado: ${command}`);
            return true;
        } catch (error) {
            console.error('Error al enviar comando:', error);
            return false;
        }
    }
    
    checkResponse() {
        try {
            if (fs.existsSync(this.responseFile)) {
                const response = fs.readFileSync(this.responseFile, 'utf8');
                fs.unlinkSync(this.responseFile); // Eliminar archivo después de leer
                return response.trim();
            }
            return null;
        } catch (error) {
            console.error('Error al leer respuesta:', error);
            return null;
        }
    }
}

module.exports = CommandSender;
