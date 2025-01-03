import React, { useEffect, useState } from 'react';
import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';

const TerminalComponent = () => {
    const [getMethod, setMethod] = useState<string>('');
    const [getRequestUrl, setRequestUrl] = useState<string>('');
    const commandHandler = (text: any) => {
        let response;
        let argsIndex = text.indexOf(' ');
        let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

        switch (command) {
            case 'method':
                let tempMethod = text.substring(argsIndex + 1);
                setMethod(tempMethod);
                response = "Method defined: " + tempMethod;
                break;

            case 'greet':
                response = 'Hola ' + text.substring(argsIndex + 1) + '!';
                break;

            case 'request':
                let tempRequestUrl = text.substring(argsIndex + 1);
                setRequestUrl(tempRequestUrl);
                response = "Request URL: " + tempRequestUrl;
                break;

            case 'show':
                console.log(getMethod)
                response = "Preview request command: " + getMethod + ": " + getRequestUrl;
                break;

            case 'clear':
                response = null;
                break;

            case 'run':
                alert(1)
                TerminalService.emit('response', response);
                break;

            default:
                response = 'Unknown command: ' + command;
                break;
        }

        if (response) {
            TerminalService.emit('response', response);
        }
        else {
            TerminalService.emit('clear');
        }
    }

    useEffect(() => {
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        }
    }, []);

    function getCookie(name:any) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {let res = parts.pop()?.split(';')?.shift(); return res;}else{return null}
    } 

    return (
        <Terminal className="terminal" prompt={"grbSite@" + (getCookie("name") || "Usuario") + "$ "} />
    );
}

export default TerminalComponent;