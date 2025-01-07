import * as fs from 'fs';
import * as vscode from 'vscode';

function classifyLog(logLine: string): { explanation: string, suggestion: string, isServiceStatus: boolean } {
  if (logLine.includes('Apache service started')) {
    return {
      explanation: 'Apache service has started successfully.',
      suggestion: 'You can access your local server via localhost.',
      isServiceStatus: true,
    };
  }
  if (logLine.includes('Apache service stopped')) {
    return {
      explanation: 'Apache service has been stopped.',
      suggestion: 'To restart Apache, click the "Start" button in XAMPP.',
      isServiceStatus: true,
    };
  }

  if (logLine.includes('MySQL service started')) {
    return {
      explanation: 'MySQL service has started successfully.',
      suggestion: 'You can now connect to your database.',
      isServiceStatus: true,
    };
  }
  if (logLine.includes('MySQL service stopped')) {
    return {
      explanation: 'MySQL service has been stopped.',
      suggestion: 'To restart MySQL, click the "Start" button in XAMPP.',
      isServiceStatus: true,
    };
  }

  if (logLine.includes('FileZilla Server Started')) {
    return {
      explanation: 'FileZilla FTP service has started.',
      suggestion: 'You can now connect via FTP to your server.',
      isServiceStatus: true,
    };
  }
  if (logLine.includes('FileZilla Server Stopped')) {
    return {
      explanation: 'FileZilla FTP service has stopped.',
      suggestion: 'To restart FileZilla, click the "Start" button in XAMPP.',
      isServiceStatus: true,
    };
  }

  if (logLine.includes('Mercury service started')) {
    return {
      explanation: 'Mercury Mail service has started.',
      suggestion: 'You can now send/receive mail using Mercury.',
      isServiceStatus: true,
    };
  }
  if (logLine.includes('Mercury service stopped')) {
    return {
      explanation: 'Mercury Mail service has stopped.',
      suggestion: 'To restart Mercury, click the "Start" button in XAMPP.',
      isServiceStatus: true,
    };
  }

  if (logLine.includes('Tomcat service started')) {
    return {
      explanation: 'Tomcat service has started successfully.',
      suggestion: 'You can access your web applications running on Tomcat.',
      isServiceStatus: true,
    };
  }
  if (logLine.includes('Tomcat service stopped')) {
    return {
      explanation: 'Tomcat service has been stopped.',
      suggestion: 'To restart Tomcat, click the "Start" button in XAMPP.',
      isServiceStatus: true,
    };
  }

  return {
    explanation: 'This is a general log message from XAMPP.',
    suggestion: 'Please review the context of the error to determine the next steps.',
    isServiceStatus: false,
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
            const { explanation, suggestion, isServiceStatus } = classifyLog(line);

            if (isServiceStatus) {
              outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Service Status:`);
              outputChannel.appendLine(`Log: ${line}`);
              outputChannel.appendLine(`Explanation: ${explanation}`);
              outputChannel.appendLine(`Suggestion: ${suggestion}`);
              outputChannel.appendLine('------------------------------------------------------');
            } else {
              outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${logFilePath}:`);
              outputChannel.appendLine(`Log: ${line}`);
              outputChannel.appendLine(`Explanation: ${explanation}`);
              outputChannel.appendLine(`Suggestion: ${suggestion}`);
              outputChannel.appendLine('------------------------------------------------------');
            }
          });
        });
      }
    });
  });
}
