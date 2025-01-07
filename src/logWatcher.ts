import * as fs from 'fs';
import * as vscode from 'vscode';

function classifyLog(logLine: string): { explanation: string, suggestion: string } {
  if (logLine.includes('AH00112')) {
    return {
      explanation: 'The error "AH00112" typically occurs when Apache cannot bind to the specified port, often due to a conflict with another process.',
      suggestion: 'Check if another application (like Skype or another web server) is using port 80, and try changing the port in your XAMPP settings.'
    };
  }
  
  if (logLine.includes('InnoDB:')) {
    return {
      explanation: 'This error is related to the InnoDB storage engine in MySQL.',
      suggestion: 'Try restarting MySQL. If the issue persists, check for any corruption in your MySQL databases.'
    };
  }

  return {
    explanation: 'This is a general log message from XAMPP.',
    suggestion: 'Please review the context of the error to determine the next steps.'
  };
}

export function watchLogFiles(logFilePaths: string[], outputChannel: vscode.OutputChannel) {
  logFilePaths.forEach((logFilePath) => {
    fs.watchFile(logFilePath, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading log file:', err);
            return;
          }

          const logLines = data.split('\n');
          logLines.forEach(line => {
            const { explanation, suggestion } = classifyLog(line);

            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${logFilePath}:`);
            outputChannel.appendLine(`Log: ${line}`);
            outputChannel.appendLine(`Explanation: ${explanation}`);
            outputChannel.appendLine(`Suggestion: ${suggestion}`);
            outputChannel.appendLine('------------------------------------------------------');
          });
        });
      }
    });
  });
}
